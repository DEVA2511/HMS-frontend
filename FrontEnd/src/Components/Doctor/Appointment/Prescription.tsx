import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";

import { Toolbar } from "primereact/toolbar";
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Grid,
  Modal,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconEye,
  IconMedicineSyrup,
  IconSearch,
  IconLayoutGrid,
  IconList,
} from "@tabler/icons-react";

import { useForm } from "@mantine/form";

import { useSelector } from "react-redux";
import { getPrescriptionByPatientId } from "../../../Service/AppointmentService";
import { formatDate } from "../../../Utility/FormateDate";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import PrescriptionCard from "./PrescriptionCard";

const Prescription = ({ appointment }: any) => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [medicineData, setMedicineData] = useState<any>([]);
  const [viewMode, setViewMode] = useState<"list" | "card">("list"); // Add view mode state
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  const user = useSelector((state: any) => state.user);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [data, setData] = useState<any>([]);

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
      doctorName: "",
      doctorId: user.profileId,
      patientId: "",
      reason: "",
      notes: "",
    },
    validate: {
      patientId: (value: any) => (value ? null : "Patient is required"),
      reason: (value: any) => (value ? null : "Reason is required"),
    },
  });

  useEffect(() => {
    if (!appointment?.patientId) return;

    const fetchPrescriptions = async () => {
      try {
        const prescriptions = await getPrescriptionByPatientId(
          appointment.patientId
        );
        setData(prescriptions);
      } catch (err) {
        console.error("Error fetching prescriptions", err);
      }
    };

    fetchPrescriptions();
  }, [appointment?.patientId]);

  const rightToolbarTemplate = () => {
    return (
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
    );
  };

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
        <ActionIcon onClick={() => handleMedicine(rowData.medicines)}>
          <IconMedicineSyrup size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    );
  };
  const handleMedicine = (medicines: any[]) => {
    console.log("Medicines:", medicines); // debug once
    setMedicineData(medicines || []);
    open();
  };

  return (
    <div className="card">
      <Toolbar
        className="mb-4"
        // start={centerToolBarTemplate}
        end={rightToolbarTemplate}
      />

      {/* Conditional Rendering: Card View or List View */}
      {viewMode === "card" ? (
        <div className="grid p-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.length > 0 ? (
            data.map((prescription: any) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                onView={() =>
                  navigate("/doctor/appointments/" + prescription.appointmentId)
                }
                onViewMedicines={handleMedicine}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <Text c="dimmed" size="lg">
                No prescriptions found.
              </Text>
            </div>
          )}
        </div>
      ) : (
        <DataTable
          value={data}
          stripedRows
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
          globalFilterFields={[
            "doctorName",
            "prescriptionDate",
            "medicines",
            "notes",
            "status",
          ]}
          emptyMessage="No appointments found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column
            field="doctorName"
            header="Doctor"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="prescriptionDate"
            header="Prescription Date"
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
          <Column field="notes" header="Notes" style={{ minWidth: "14rem" }} />
          <Column
            field="status"
            header="Status"
            body={actionBodyTemplate}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
      )}
      <Modal
        opened={opened}
        size="lg"
        onClose={close}
        title="Medicine"
        centered
      >
        {/* here i need th card compont for medicine modal */}
        <div className="grid grid-cols-2 gap-4">
          {medicineData?.map((data: any, index: number) => (
            <Card
              key={index}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              mb="md"
            >
              <Title order={4} mb="sm">
                {data.name} {data.type}
              </Title>

              <Divider my="sm" />

              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" fw={500}>
                    Dosage:
                  </Text>
                  <Text>{data.dosage}</Text>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Text size="sm" fw={500}>
                    Frequency:
                  </Text>
                  <Text>{data.frequency}</Text>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Text size="sm" fw={500}>
                    Duration:
                  </Text>
                  <Text>{data.duration} days</Text>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Text size="sm" fw={500}>
                    Route:
                  </Text>
                  <Text>{data.route}</Text>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Text size="sm" fw={500}>
                    Instructions:
                  </Text>
                  <Text>{data.instructions}</Text>
                </Grid.Col>
              </Grid>
            </Card>
          ))}
        </div>
        {medicineData.length === 0 && (
          <Text color="dimed" size="sm" mt="md">
            No medicine prescribed for this appointment
          </Text>
        )}
      </Modal>
    </div>
  );
};

export default Prescription;
