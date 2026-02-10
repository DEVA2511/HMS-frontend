import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Fieldset,
  Grid,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  SelectProps,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconCheck,
  IconDashboard,
  IconEye,
  IconHome,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";

import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../Utility/Notification";
import { useEffect, useState } from "react";

import { Column } from "primereact/column";

import { DataTable, DataTableFilterMeta } from "primereact/datatable";

import { FilterMatchMode } from "primereact/api";

import { getAllMedicines } from "../../../Service/MedicineService";

import {
  addsales,
  getAllsales,
  getSaleItems,
} from "../../../Service/SalesService";
import React from "react";
import { formatDate } from "../../../Utility/FormateDate";
import { useDisclosure } from "@mantine/hooks";
import { Spotlight, spotlight, SpotlightActionData } from "@mantine/spotlight";
import {
  getAllPrescriptions,
  getMedicinesByPrescriptionId,
} from "../../../Service/AppointmentService";
import { freqMap } from "../../../Data/DropDownData";

type Inventory = {
  name: string;
  InventoryId?: number;
  dosage: string;
  frequency: string;
  duration: number;
  // route: string;
  type: string;
  instructions: string;
  prescriptionId?: number;
};
interface SaleItem {
  quantity: 0;
  medicineId: "";
}

const Sales = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [data, setData] = useState<any>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    // @ts-ignore
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const [medicine, setMedicine] = useState<any[]>([]);
  const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});

  const [opened, { open, close }] = useDisclosure(false);
  const [saleItem, setSaleItem] = useState<any>([]);
  const [actions, setActions] = useState<SpotlightActionData[]>([]);
  const form = useForm({
    initialValues: {
      buyerName: "",
      buyerContact: "",

      saleItem: [{ medicineId: "", quantity: 0 }] as any[],
    },
    validate: {
      saleItem: {
        medicineId: (value: any) => (value ? null : "medicine is required"),

        quantity: (value: any) => (value ? null : "Quantity is required"),
      },
    },
  });

  const handleDetailes = (rowData: any) => {
    open();
    setLoading(true);
    getSaleItems(rowData.id)
      .then((res) => {
        setSaleItem(res);
        console.log(res);
      })
      .catch((err: any) =>
        ERROR_NOTIFICATION(
          err.response?.data?.message || "Failed to get sale items"
        )
      )
      .finally(() => {
        setLoading(false);
      });
  };
  const handleFormSubmit = (values: any) => {
    let update = false;
    let flag = false;
    values.saleItem.forEach((x: any) => {
      if (x.quantity > medicineMap[x.medicineId]?.quantity) {
        ERROR_NOTIFICATION(
          `Insufficient stock for ${medicineMap[x.medicineId]?.name}`
        );
        flag = true;
        form.setFieldError(
          `saleItem.${x.medicineId}.quantity`,
          "Insufficient stock"
        );
      }
    });
    if (flag) {
      ERROR_NOTIFICATION("Please check the stock");
      return;
    }

    const saleItems = values.saleItem.map((x: any) => ({
      medicineId: Number(x.medicineId),
      quantity: x.quantity,
      unitPrice: medicineMap[x.medicineId]?.unitPrice,
      totalPrice: medicineMap[x.medicineId]?.unitPrice * x.quantity,
    }));
    const totalAmount = saleItems.reduce(
      (acc: any, item: any) => acc + item.unitPrice * item.quantity,
      0
    );
    setLoading(true);
    addsales({ ...values, saleItems, totalAmount })
      .then((_res: any) => {
        SUCCESS_NOTIFICATION("Medicine sold successfully");
        form.reset();
        setEdit(false);
        fetchData();
      })
      .catch((err: any) =>
        ERROR_NOTIFICATION(
          err.response?.data?.message || "Failed to sell medicine"
        )
      )
      .finally(() => setLoading(false));
  };

  // spotlight

  const handleImportPrescription = (prescription: any) => {
    console.table(prescription);
    setLoading(true);
    getMedicinesByPrescriptionId(prescription.id)
      .then((res: any) => {
        setSaleItem(res);
        form.setValues({
          ...form.values,
          buyerName: prescription.patientName || "",
          buyerContact: prescription.patientPhone || "",
          saleItem: res.map((x: any) => ({
            medicineId: String(x.medicineId),
            quantity: calculateQuantity(x.frequency, x.duration),
          })),
        });
        SUCCESS_NOTIFICATION("Prescription imported successfully");
        setLoading(false);
      })
      .catch((err: any) => {
        ERROR_NOTIFICATION(
          err.response?.data?.message || "Failed to import prescription"
        );
        setLoading(false);
      });
  };
  const calculateQuantity = (freq: string, duration: number) => {
    const freqValue = freqMap[freq] || 0;
    return Math.ceil(freqValue * duration);
  };

  const handleSpotLight = () => {
    spotlight.open();
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-warp gap-2 justify-between items-center">
        <Button variant="filled" onClick={() => setEdit(true)}>
          Sell Medicince
        </Button>

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
  const onViewSale = (rowData: any) => {
    getSaleItems(rowData.id).then((res) => {
      modals.open({
        title: (
          <span className="text-lg font-bold">
            Sale Items (ID: {rowData.id})
          </span>
        ),
        centered: true,
        size: "lg",
        children: (
          <div className="grid gap-4">
            <DataTable value={res} size="small" stripedRows>
              <Column
                header="Medicine"
                body={(item) => medicineMap[item.medicineId]?.name || "Unknown"}
              />
              <Column field="batchNumber" header="Batch" />
              <Column field="quantity" header="Qty" />
              <Column
                field="unitPrice"
                header="Unit Price"
                body={(item) => `₹${item.unitPrice.toFixed(2)}`}
              />
              <Column
                header="Total"
                body={(item) =>
                  `₹${(item.unitPrice * item.quantity).toFixed(2)}`
                }
              />
            </DataTable>
            <div className="text-right font-bold text-lg mt-2">
              Grand Total: ₹{rowData.totalAmount.toFixed(2)}
            </div>
          </div>
        ),
      });
    });
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon onClick={() => handleDetailes(rowData)}>
          <IconEye size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    );
  };
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
    getAllPrescriptions()
      .then((res) => {
        console.log("Prescriptions fetched:", res);
        setActions(
          res.map((item: any) => ({
            id: String(item.id),
            label:
              item.patientName || item.diagnosis || `Prescription ${item.id}`,
            description: `Dr. ${item.doctorName} on ${formatDate(item.prescriptionDate)}`,
            onClick: () => handleImportPrescription(item),
          }))
        );
      })
      .catch((error) => {
        console.log("error ", error);
      });
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    getAllsales()
      .then((res) => {
        setData([...res]);
        console.log("res ", res);
      })
      .catch((err) => {
        ERROR_NOTIFICATION(
          err.response?.data?.message || "Error fetching Sales"
        );
      })
      .finally(() => setLoading(false));
  };

  const cancel = () => {
    form.reset();
    setEdit(false);
  };
  const addMore = () => {
    form.insertListItem("saleItem", { medicineId: "", quantity: 0 });
  };

  return (
    <div>
      <div className="card">
        {!edit ? (
          <DataTable
            removableSort
            value={data}
            stripedRows
            header={renderHeader}
            paginator
            size="small"
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            selectionMode="checkbox"
            selection={selectedCustomers}
            onSelectionChange={(e) => setSelectedCustomers(e.value)}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={["id", "totalAmount"]}
            emptyMessage="No sales found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column
              field="buyerName"
              header="Buyer Name"
              style={{ minWidth: "10rem" }}
            />
            <Column
              field="buyerContact"
              header="Buyer Contact"
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="saleDate"
              header="Sale Date"
              sortable
              style={{ minWidth: "14rem" }}
              body={(rowData) => formatDate(rowData.saleDate)}
            />
            <Column
              field="totalAmount"
              header="Total Amount"
              sortable
              body={(rowData) => <span>₹{rowData.totalAmount}</span>}
              style={{ minWidth: "12rem" }}
            />
            <Column
              header="Actions"
              body={actionBodyTemplate}
              style={{ minWidth: "8rem" }}
            />
          </DataTable>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl text-primary-500 font-medium tracking-wider">
                Sell Medicine
              </h3>
              <Button
                variant="filled"
                leftSection={<IconPlus size={20} />}
                onClick={handleSpotLight}
              >
                Import Prescription
              </Button>
            </div>
            <form
              onSubmit={form.onSubmit(handleFormSubmit)}
              className="grid gap-5"
            >
              <LoadingOverlay visible={loading} />{" "}
              <Fieldset
                className="grid gap-5"
                legend={
                  <span className="text-lg font-medium text-primary-500">
                    Buyer Information
                  </span>
                }
                radius="md"
              >
                <div className="grid gap-4 grid-cols-2">
                  <TextInput
                    withAsterisk
                    label="Buyer Name"
                    placeholder="Enter buyer name"
                    {...form.getInputProps("buyerName")}
                  />
                  <NumberInput
                    withAsterisk
                    label="Buyer Phone"
                    placeholder="Enter buyer phone"
                    maxLength={10}
                    {...form.getInputProps("buyerContact")}
                  />
                  {/* <TextInput
                  withAsterisk
                  label="Buyer Address"
                  {...form.getInputProps("buyerAddress")}
                /> */}
                </div>
              </Fieldset>
              <Fieldset
                className="grid gap-5"
                legend={
                  <span className="text-lg font-medium text-primary-500">
                    Medicine Information
                  </span>
                }
                radius="md"
              >
                <div className="grid gap-4 grid-cols-5">
                  {form.values.saleItem.map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="col-span-2">
                        <Select
                          renderOption={renderSelectOption}
                          {...form.getInputProps(
                            `saleItem.${index}.medicineId`
                          )}
                          label="Medicine"
                          placeholder="Select medicine"
                          data={medicine
                            .filter(
                              (x) =>
                                !form.values.saleItem.some(
                                  (item1: any, idx) =>
                                    item1.medicineId === String(x.id) &&
                                    idx !== index
                                )
                            )
                            .map((item) => ({
                              ...item,
                              value: String(item.id),
                              label: item.name,
                              ...item,
                            }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <NumberInput
                          rightSectionWidth={90}
                          rightSection={
                            <div className="text-xs text-gray-600">
                              Stock : {medicineMap[item.medicineId]?.stock}
                            </div>
                          }
                          {...form.getInputProps(`saleItem.${index}.quantity`)}
                          label="Quantity"
                          placeholder="Enter quantity"
                          withAsterisk
                          min={0}
                          max={medicineMap[item.medicineId]?.stock || 0}
                          clampBehavior="strict"
                        />
                      </div>
                      <div className="flex items-end justify-between">
                        {item.quantity && item.medicineId ? (
                          <div>
                            Total: {item.quantity} X{" "}
                            {medicineMap[item.medicineId]?.unitPrice} =
                            {item.quantity *
                              medicineMap[item.medicineId]?.unitPrice}
                          </div>
                        ) : (
                          <div></div>
                        )}
                        <ActionIcon
                          color="red"
                          size="lg"
                          onClick={() => form.removeListItem("saleItem", index)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex items-center justify-center  ">
                  <Button
                    variant="outline"
                    onClick={addMore}
                    leftSection={<IconPlus size={16} />}
                  >
                    Add more
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
                  Sell Medicine
                </Button>
                <Button size="md" variant="filled" color="red" onClick={cancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
        <Modal
          opened={opened}
          size="lg"
          onClose={close}
          title="Sold Medicine Details"
          centered
        >
          {/* here i need th card compont for medicine modal */}
          <div className="grid grid-cols-2 gap-4">
            {saleItem?.map((data: any, index: number) => (
              <Card
                key={index}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                mb="md"
              >
                <Title order={4} mb="sm">
                  {medicineMap[data.medicineId]?.name}-
                  {medicineMap[data.medicineId]?.dosage} ({" "}
                  {medicineMap[data.medicineId]?.manufacturer})
                </Title>
                <Text size="xs" fw={500}>
                  {data.batchNumber}
                </Text>
                <Divider my="sm" />

                <Grid>
                  <Grid.Col span={4}>
                    <Text size="sm" fw={500}>
                      Quantity:
                    </Text>
                    <Text>{data.quantity}</Text>
                  </Grid.Col>

                  <Grid.Col span={4}>
                    <Text size="sm" fw={500}>
                      Unit Price:
                    </Text>
                    <Text>{medicineMap[data.medicineId]?.unitPrice}</Text>
                  </Grid.Col>

                  <Grid.Col span={4}>
                    <Text size="sm" fw={500}>
                      Total
                    </Text>
                    <Text>
                      {data.quantity * medicineMap[data.medicineId]?.unitPrice}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Card>
            ))}
          </div>
          {saleItem.length === 0 && (
            <Text color="dimed" size="sm" mt="md">
              No medicine prescribed for this appointment
            </Text>
          )}
        </Modal>

        <Spotlight
          actions={actions}
          nothingFound="Nothing found..."
          highlightQuery
          shortcut={["mod + K", "mod + P", "/"]}
          searchProps={{
            leftSection: <IconSearch size={20} stroke={1.5} />,
            placeholder: "Search...",
          }}
        />
      </div>
    </div>
  );
};

export default Sales;
