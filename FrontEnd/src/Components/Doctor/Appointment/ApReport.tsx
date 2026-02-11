import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  SelectProps,
  TextInput,
  Text as MantineText,
} from "@mantine/core";
import {
  dosageFrequency,
  medicineType,
  sysmptoms,
  test,
} from "../../../Data/DropDownData";
import {
  IconCheck,
  IconEye,
  IconSearch,
  IconTrash,
  IconLayoutGrid,
  IconList,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
  createAppointmentReport,
  getAppointmentReport,
  getPrescriptionByPatientId,
  isReportExists,
  updateAppointmentReport,
} from "../../../Service/AppointmentService";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../Utility/Notification";
import { useCallback, useEffect, useState } from "react";

import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { useNavigate } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import { formatDate } from "../../../Utility/FormateDate";
import { getAllMedicines } from "../../../Service/MedicineService";
import ReportCard from "./ReportCard";

type Medicine = {
  name: string;
  medicineId?: string | number | undefined;
  dosage: string;
  frequency: string;
  duration: number;
  // route: string;
  type: string;
  instructions: string;
  prescriptionId?: number;
};

const ApReport = ({ appointment }: any) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  // const user = useSelector((state: any) => state.user);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [data, setData] = useState<any>([]);
  const [viewMode, setViewMode] = useState<"list" | "card">("list"); // Add view mode state
  const [allowAdd, setAllowAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [reportId, setReportId] = useState<number | null>(null);
  const [medicine, setMedicine] = useState<any[]>([]);
  const [medicineMap, setMedicineMap] = useState<any>({});
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    // @ts-ignore
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const form = useForm({
    initialValues: {
      symptoms: [],

      tests: [],
      diagnosis: "",
      referral: "",
      notes: "",
      prescription: {
        medicines: [] as Medicine[],
      },
    },
    validate: {
      symptoms: (v: any) => (v?.length ? null : "Select symptoms"),
      diagnosis: (v: any) => (v?.trim() ? null : "Diagnosis required"),
      notes: (value: any) => (value?.trim() ? null : "Please enter a notes"),
      prescription: {
        medicines: {
          name: (value: any) =>
            value?.length > 0 ? null : "Please enter a Medicine Name",
          medicineId: (value: any) =>
            value >= 0 || value === "OTHERS"
              ? null
              : "Please enter a medicineId",
          dosage: (value: any) =>
            value?.length > 0 ? null : "Please enter a dosage",
          frequency: (value: any) =>
            value?.length > 0 ? null : "Please enter a frequency",
          duration: (value: any) =>
            value > 0 ? null : "Please enter a duration",
          // route: (value: any) =>
          //   value?.length > 0 ? null : "Please enter a route",
          type: (value: any) =>
            value?.length > 0 ? null : "Please enter a type",
          instructions: (value: any) =>
            value?.trim() ? null : "Please enter a instruction",
        },
      },
    },
  });
  useEffect(() => {
    getAllMedicines()
      .then((res) => {
        setMedicine(res);
        setMedicineMap(
          res.reduce((acc: any, item: any) => {
            acc[item.id] = item;
            return acc;
          }, {})
        );
      })
      .catch((error) => {
        console.log("error ", error);
      });
  }, []);
  const insertMedicine = () => {
    form.insertListItem("prescription.medicines", {
      name: "",
      medicineId: 0,
      dosage: "",
      frequency: "",
      duration: 0,
      // route: "",
      type: "",
      instructions: "",
    });
  };
  const removeMedicine = (index: number) => {
    form.removeListItem("prescription.medicines", index);
  };
  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }: any) => (
    <Group flex="1" gap="xs">
      <div className="flex gap-5 item-center">
        {option.label}
        {option.manufacturer && (
          <span
            style={{ marginLeft: "auto", fontSize: "0.8em", color: "gray" }}
          >
            {option.manufacturer} - {option.dosage}
          </span>
        )}
      </div>
      {checked && <IconCheck style={{ marginInlineStart: "auto" }} />}
    </Group>
  );

  const handleFormSubmit = (values: typeof form.values) => {
    const data = {
      ...values,
      appointmentId: appointment.id,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      prescription: {
        ...values.prescription,
        medicines: values.prescription.medicines.map((med) => ({
          ...med,
          medicineId: med.medicineId === "OTHERS" ? null : med.medicineId,
        })),
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        appointmentId: appointment.id,
      },
    };

    if (reportId) {
      // @ts-ignore
      data.id = reportId;
      // @ts-ignore
      data.prescription.id = reportId;
    }

    if (!values.prescription.medicines.length) {
      ERROR_NOTIFICATION("Please add at least one medicine");
      return;
    }

    for (const med of values.prescription.medicines) {
      if (!med.name || !med.dosage || !med.frequency || !med.duration) {
        ERROR_NOTIFICATION("Fill all medicine fields");
        return;
      }
    }

    setLoading(true);
    const serviceCall = reportId
      ? updateAppointmentReport(data)
      : createAppointmentReport(data);

    serviceCall
      .then(() => {
        SUCCESS_NOTIFICATION(
          reportId
            ? "Report updated successfully"
            : "Report created successfully"
        );
        form.reset();
        setEdit(false);
        setReportId(null);
        fetchData();
      })
      .catch(() =>
        ERROR_NOTIFICATION(
          reportId ? "Failed to update Report" : "Failed to create Report"
        )
      )
      .finally(() => setLoading(false));
  };
  const canAddReport = useCallback(() => {
    return (
      appointment?.status === "SCHEDULED" || appointment?.status === "CANCELLED"
    );
  }, [appointment?.status]);

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon
          onClick={() =>
            navigate("/doctor/appointments/" + rowData.appointmentId)
          }
        >
          <IconEye size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    );
  };

  const handleChangeMed = (medId: any, index: number) => {
    // const medId = value;
    if (medId && medId !== "OTHERS") {
      form.setFieldValue(
        `prescription.medicines.${index}.medicineId`,
        medId || ""
      );
      form.setFieldValue(
        `prescription.medicines.${index}.name`,
        medicineMap[medId].name || ""
      );
      form.setFieldValue(
        `prescription.medicines.${index}.dosage`,
        medicineMap[medId].dosage || ""
      );

      form.setFieldValue(
        `prescription.medicines.${index}.type`,
        medicineMap[medId]?.type || ""
      );
    } else {
      // form.setFieldValue(
      //   `prescription.medicines.${index}.medicineId`,
      //   undefined
      // );
      form.setFieldValue(`prescription.medicines.${index}.name`, "OTHERS");
      form.setFieldValue(`prescription.medicines.${index}.dosage`, "OTHERS");
      form.setFieldValue(`prescription.medicines.${index}.type`, "OTHERS");
    }
  };

  const handleEditReport = async () => {
    setLoading(true);
    try {
      const report = await getAppointmentReport(appointment.id);
      if (report) {
        setReportId(report.id);
        form.setValues({
          symptoms: report.symptoms || [],
          tests: report.tests || [],
          diagnosis: report.diagnosis || "",
          referral: report.referral || "",
          notes: report.notes || "",
          prescription: {
            medicines: report.prescription?.medicines || [],
          },
        });
        setEdit(true);
      }
    } catch (error) {
      ERROR_NOTIFICATION("Failed to fetch existing report");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-warp gap-2 justify-between items-center">
        {allowAdd ? (
          <Button variant="filled" onClick={() => setEdit(true)}>
            Add Report
          </Button>
        ) : (
          canAddReport() && (
            <Button
              variant="outline"
              loading={loading}
              onClick={handleEditReport}
            >
              Edit Report
            </Button>
          )
        )}
        <div className="flex gap-2 items-center">
          {/* View Toggle Buttons */}
          <ActionIcon.Group>
            <ActionIcon
              variant={viewMode === "list" ? "filled" : "default"}
              color="blue"
              size="lg"
              onClick={() => setViewMode("list")}
            >
              <IconList size={20} />
            </ActionIcon>
            <ActionIcon
              variant={viewMode === "card" ? "filled" : "default"}
              color="blue"
              size="lg"
              onClick={() => setViewMode("card")}
            >
              <IconLayoutGrid size={20} />
            </ActionIcon>
          </ActionIcon.Group>
          <TextInput
            leftSection={<IconSearch />}
            fw={500}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search..."
          />
        </div>
      </div>
    );
  };
  const fetchData = useCallback(async () => {
    if (!appointment?.patientId) return;

    try {
      const prescriptions = await getPrescriptionByPatientId(
        appointment.patientId
      );
      setData(prescriptions);
    } catch (err) {
      console.error("Error fetching prescriptions", err);
    }

    try {
      const exists = await isReportExists(appointment.id);
      setAllowAdd(!exists && canAddReport());
    } catch (err: any) {
      ERROR_NOTIFICATION(
        err?.response?.data?.errorMessage || "Error checking report existence"
      );
      setAllowAdd(false);
    }
  }, [appointment?.patientId, appointment?.id]);

  return (
    <div>
      <div className="card">
        {!edit ? (
          viewMode === "card" ? (
            <>
              {renderHeader()}
              <div className="grid p-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {data.length > 0 ? (
                  data.map((report: any) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onView={() =>
                        navigate("/doctor/appointments/" + report.appointmentId)
                      }
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <MantineText c="dimmed" size="lg">
                      No reports found.
                    </MantineText>
                  </div>
                )}
              </div>
            </>
          ) : (
            <DataTable
              value={data}
              stripedRows
              header={renderHeader}
              paginator
              size="small"
              rows={10}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              rowsPerPageOptions={[10, 25, 50]}
              dataKey="id"
              selectionMode="checkbox"
              selection={selectedCustomers}
              onSelectionChange={(e) => setSelectedCustomers(e.value)}
              filters={filters}
              filterDisplay="menu"
              globalFilterFields={["doctorName", "diagnosis", "notes"]}
              emptyMessage="No appointments found."
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              />
              <Column
                field="doctorName"
                header="Doctor"
                style={{ minWidth: "14rem" }}
              />
              <Column
                field="diagnosis"
                header="Diagnosis"
                style={{ minWidth: "14rem" }}
              />
              <Column
                field="prescriptionDate"
                header="Report Date"
                sortable
                body={(rowData) => {
                  return formatDate(rowData.prescriptionDate);
                }}
              />

              <Column
                field="medicines"
                header="Medicine"
                body={(rowData) => {
                  return rowData.medicines?.length ?? 0;
                }}
              />
              <Column
                field="notes"
                header="Notes"
                style={{ minWidth: "14rem" }}
              />
              <Column
                field="status"
                header="Status"
                body={actionBodyTemplate}
                style={{ minWidth: "12rem" }}
              />
            </DataTable>
          )
        ) : (
          <form onSubmit={form.onSubmit(handleFormSubmit)}>
            {" "}
            <Fieldset
              className="grid gap-4 grid-cols-2"
              legend={
                <span className="text-lg font-medium text-primary-500">
                  Personal information
                </span>
              }
              radius="md"
            >
              <MultiSelect
                {...form.getInputProps("symptoms")}
                className="col-span-2"
                withAsterisk
                label="Symptoms"
                placeholder="Select Symptoms"
                data={sysmptoms}
              />
              <MultiSelect
                {...form.getInputProps("tests")}
                className="col-span-2"
                withAsterisk
                label="Test"
                placeholder="Select Test"
                data={test}
              />
              <TextInput
                {...form.getInputProps("diagnosis")}
                label="Diagnosis"
                placeholder="Enter Diagnosis"
                withAsterisk
              />
              <TextInput
                {...form.getInputProps("referral")}
                label="Referral"
                placeholder="Enter Referral details"
                withAsterisk
              />
              <TextInput
                {...form.getInputProps("notes")}
                className="col-span-2"
                label="Notes"
                placeholder="Enter any aditional Notes"
              />
            </Fieldset>
            <Fieldset
              className="grid gap-4 "
              legend={
                <span className="text-lg font-medium text-primary-500">
                  Prescription
                </span>
              }
              radius="md"
            >
              {form.values.prescription.medicines.map(
                (med: Medicine, index: number) => (
                  <Fieldset
                    key={index}
                    legend={
                      <div className="flex justify-between items-center gap-5">
                        <h1 className="text-lg font-medium">
                          Medicine {index + 1}
                        </h1>
                        <ActionIcon
                          variant="filled"
                          color="red"
                          size="lg"
                          className="mb-2"
                          onClick={() => removeMedicine(index)}
                        >
                          <IconTrash />
                        </ActionIcon>
                      </div>
                    }
                    className="grid gap-4 grid-cols-2"
                  >
                    {/* here the select option medicine is not avalbel means show the other option to add medicine */}
                    <Select
                      renderOption={renderSelectOption}
                      {...form.getInputProps(
                        `prescription.medicines.${index}.medicineId`
                      )}
                      label="Medicine"
                      placeholder="Select medicine"
                      onChange={(value: any) => handleChangeMed(value, index)}
                      data={[
                        ...medicine
                          .filter(
                            (x) =>
                              !form.values.prescription.medicines.some(
                                (item1: any, idx) =>
                                  item1.medicineId === String(x.id) &&
                                  idx !== index
                              )
                          )
                          .map((item) => ({
                            ...item,
                            value: String(item.id),
                            label: item.name,
                          })),
                        { label: "Others", value: "OTHERS" },
                      ]}
                      withAsterisk
                    />

                    {med.medicineId === "OTHERS" && (
                      <TextInput
                        {...form.getInputProps(
                          `prescription.medicines.${index}.name`
                        )}
                        label="Medicine"
                        placeholder="Enter medicine name"
                        withAsterisk
                      />
                    )}
                    <TextInput
                      disabled={med.medicineId !== "OTHERS"}
                      {...form.getInputProps(
                        `prescription.medicines.${index}.dosage`
                      )}
                      label="Dosage"
                      placeholder="Enter dosage"
                      withAsterisk
                    />
                    <Select
                      {...form.getInputProps(
                        `prescription.medicines.${index}.frequency`
                      )}
                      label="Frequency"
                      placeholder="Enter frequency"
                      withAsterisk
                      data={dosageFrequency}
                    />
                    <NumberInput
                      {...form.getInputProps(
                        `prescription.medicines.${index}.duration`
                      )}
                      label="Duration (days)"
                      placeholder="Enter duration"
                      withAsterisk
                    />
                    {/* <Select
                      {...form.getInputProps(
                        `prescription.medicines.${index}.route`
                      )}
                      label="Route"
                      placeholder="Select route"
                      withAsterisk
                      data={["Oral", "Intravenous", "Intramuscular"]}
                    /> */}
                    <Select
                      disabled={med.medicineId !== "OTHERS"}
                      {...form.getInputProps(
                        `prescription.medicines.${index}.type`
                      )}
                      label="Type"
                      placeholder="Select type"
                      withAsterisk
                      data={medicineType}
                    />
                    <TextInput
                      {...form.getInputProps(
                        `prescription.medicines.${index}.instructions`
                      )}
                      label="Instruction"
                      placeholder="Enter instruction"
                      withAsterisk
                    />
                  </Fieldset>
                )
              )}
              <div className=" flex items-center justify-center gap-4 ">
                <Button
                  onClick={insertMedicine}
                  variant="outline"
                  size="md"
                  className="mt-4"
                  color="primary"
                >
                  Add Medicine
                </Button>
              </div>
            </Fieldset>
            <div className=" flex items-center justify-center gap-4 ">
              <Button
                variant="filled"
                loading={loading}
                size="md"
                type="submit"
                className="w-full"
                color="primary"
              >
                Submit
              </Button>
              <Button
                size="md"
                variant="filled"
                color="red"
                onClick={() => {
                  form.reset();
                  setEdit(false);
                  setReportId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApReport;
