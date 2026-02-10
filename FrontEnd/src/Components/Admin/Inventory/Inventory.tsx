import {
  ActionIcon,
  Badge,
  Button,
  Fieldset,
  Group,
  NumberInput,
  Select,
  SelectProps,
  TextInput,
} from "@mantine/core";

import { IconCheck, IconEdit, IconSearch } from "@tabler/icons-react";
import { useForm } from "@mantine/form";

import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../Utility/Notification";
import { useEffect, useState } from "react";

import { Column } from "primereact/column";

import { DataTable, DataTableFilterMeta } from "primereact/datatable";

import { FilterMatchMode } from "primereact/api";
import {
  addStock,
  getAllStock,
  updateStock,
} from "../../../Service/InventoryService";
import { DateInput } from "@mantine/dates";
import { getAllMedicines } from "../../../Service/MedicineService";

const Inventory = ({ appointment }: any) => {
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

  const form = useForm({
    initialValues: {
      id: null,
      batchNumber: "",
      quantity: 0,
      expiryDate: "",
      medicineId: "",
    },
    validate: {
      medicineId: (value: any) => (value ? null : "medicine is required"),
      batchNumber: (value: any) => (value ? null : "Batch Number is required"),
      quantity: (value: any) => (value ? null : "Quantity is required"),
      expiryDate: (value: any) => (value ? null : "Expiry Date is required"),
    },
  });

  const handleFormSubmit = (values: any) => {
    let medthod;
    let update = false;
    if (values.id) {
      medthod = updateStock;
      update = true;
    } else {
      medthod = addStock;
    }
    setLoading(true);
    medthod(values)
      .then((_res: any) => {
        SUCCESS_NOTIFICATION(
          update
            ? "Inventory updated successfully"
            : "Inventory added successfully"
        );
        form.reset();
        setEdit(false);
        fetchData();
      })
      .catch(() =>
        ERROR_NOTIFICATION(
          update ? "Failed to update Inventory" : "Failed to add Inventory"
        )
      )
      .finally(() => setLoading(false));
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-warp gap-2 justify-between items-center">
        <Button variant="filled" onClick={() => setEdit(true)}>
          Add Stock
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
            {option.manufacturer}
          </span>
        )}
      </div>
      {checked && <IconCheck style={{ marginInlineStart: "auto" }} />}
    </Group>
  );
  const onEdit = (rowData: any) => {
    setEdit(true);
    form.setValues({
      ...rowData,
      medicineId: String(rowData.medicineId),
      batchNumber: rowData.batchNumber,
      quantity: rowData.quantity,
      expiryDate: rowData.expiryDate,
    });
  };
  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon onClick={() => onEdit(rowData)}>
          <IconEdit size={20} stroke={1.5} />
        </ActionIcon>
        {/* <ActionIcon color="red" onClick={() => removeInventory(rowData.id)}>
          <IconTrash size={18} />
        </ActionIcon> */}
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
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getAllStock();
    getAllStock()
      .then(() => {
        setData([...res]);
      })
      .catch((err) => {
        ERROR_NOTIFICATION(
          err.response?.data?.errorMessage || "Error fetching Inventorys"
        );
      });
  };
  const cancel = () => {
    form.reset();
    setEdit(false);
  };
  //   const removeInventory = (id: number) => {
  //     if (!id) return;

  //     modals.openConfirmModal({
  //       title: (
  //         <span className="text-xl font-semibold font-serif">
  //           Confirm Deletion
  //         </span>
  //       ),
  //       centered: true,
  //       children: (
  //         <Text size="sm">
  //           You are about to delete this Inventory. This action cannot be undone.
  //         </Text>
  //       ),
  //       labels: { confirm: "Delete", cancel: "Cancel" },
  //       confirmProps: { color: "red" },

  //       onConfirm: async () => {
  //         try {
  //           await deleteStock(id);
  //           SUCCESS_NOTIFICATION("Inventory deleted successfully");
  //           fetchData(); // refresh table
  //         } catch {
  //           ERROR_NOTIFICATION("Failed to delete Inventory");
  //         }
  //       },
  //     });
  //   };
  const statusBody = (rowData: any) => {
    const isExpired = new Date(rowData.expiryDate) < new Date();
    return (
      <Badge color={isExpired ? "red " : "green"}>
        {" "}
        {isExpired ? "Expired" : "Active"}{" "}
      </Badge>
    );
  };

  return (
    <div>
      <div className="card">
        {!edit ? (
          <DataTable
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
            globalFilterFields={["name", "category", "type", "manufacturer"]}
            emptyMessage="No appointments found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            {/* <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} /> */}
            <Column
              field="name"
              header="Medicine"
              body={(rowData) => (
                <span>
                  {medicineMap["" + rowData.medicineId].name}{" "}
                  <span className="text-xs text-gray-500 ">
                    {medicineMap["" + rowData.medicineId].manufacturer}
                  </span>
                </span>
              )}
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="batchNumber"
              header="Batch No"
              style={{ minWidth: "14rem" }}
            />

            <Column
              field="quantity"
              header=" Quantity"
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="quantity"
              header="Reamining Quantity"
              sortable
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="expiryDate"
              header="Expiry Date"
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="status"
              header="Status"
              body={statusBody}
              style={{ minWidth: "14rem" }}
            />
            <Column body={actionBodyTemplate} />
          </DataTable>
        ) : (
          <form
            onSubmit={form.onSubmit(handleFormSubmit)}
            className="grid gap-5"
          >
            {" "}
            <Fieldset
              className="grid gap-4 grid-cols-2"
              legend={
                <span className="text-lg font-medium text-primary-500">
                  Inventory iformation
                </span>
              }
              radius="md"
            >
              <Select
                renderOption={renderSelectOption}
                {...form.getInputProps("medicineId")}
                label="Medicine"
                placeholder="Select medicine"
                data={medicine.map((item) => ({
                  ...item,
                  value: "" + item.id,
                  label: item.name,
                }))}
              />
              <TextInput
                {...form.getInputProps("batchNumber")}
                label="Batch No"
                placeholder="Enter batch number"
                withAsterisk
              />
              <NumberInput
                {...form.getInputProps("quantity")}
                label="Quantity"
                placeholder="Enter quantity"
                withAsterisk
                min={0}
                clampBehavior="strict"
              />

              <DateInput
                {...form.getInputProps("expiryDate")}
                label="Expiry Date"
                placeholder="Enter expiry date"
                withAsterisk
                minDate={new Date()}
              />
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
                {form.values?.id ? "Update" : "Add"} Stock
              </Button>
              <Button size="md" variant="filled" color="red" onClick={cancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Inventory;
