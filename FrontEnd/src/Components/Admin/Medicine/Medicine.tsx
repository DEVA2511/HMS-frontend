import {
  ActionIcon,
  Button,
  Fieldset,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { medicineCategories, medicineType } from "../../../Data/DropDownData";

import { IconEdit, IconSearch } from "@tabler/icons-react";
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
  addMedicine,
  getAllMedicines,
  updateMedicine,
} from "../../../Service/MedicineService";

const Medicine = ({ appointment }: any) => {
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

  const form = useForm({
    initialValues: {
      id: null,
      name: "",
      dosage: "",
      category: "",
      type: "",
      manufacturer: "",
      unitPrice: "",
    },
    validate: {
      name: (value: any) => (value ? null : "Name is required"),
      dosage: (value: any) => (value ? null : "Dosage is required"),
      category: (value: any) => (value ? null : "Category is required"),
      type: (value: any) => (value ? null : "Type is required"),
      manufacturer: (value: any) => (value ? null : "Manufacturer is required"),
      unitPrice: (value: any) => (value ? null : "Unit Price is required"),
    },
  });

  const handleFormSubmit = (values: any) => {
    let medthod;
    let update = false;
    if (values.id) {
      medthod = updateMedicine;
      update = true;
    } else {
      medthod = addMedicine;
    }
    setLoading(true);
    medthod(values)
      .then((_res: any) => {
        SUCCESS_NOTIFICATION(
          update
            ? "Medicine updated successfully"
            : "Medicine added successfully"
        );
        form.reset();
        setEdit(false);
        fetchData();
      })
      .catch(() =>
        ERROR_NOTIFICATION(
          update ? "Failed to update Medicine" : "Failed to add Medicine"
        )
      )
      .finally(() => setLoading(false));
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-warp gap-2 justify-between items-center">
        <Button variant="filled" onClick={() => setEdit(true)}>
          Add Medicine
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
  const onEdit = (rowData: any) => {
    setEdit(true);
    form.setValues({
      ...rowData,
      id: rowData.id,
      name: rowData.name,
      dosage: rowData.dosage,
      category: rowData.category,
      type: rowData.type,
      manufacturer: rowData.manufacturer,
      unitPrice: rowData.unitPrice,
    });
  };
  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon onClick={() => onEdit(rowData)}>
          <IconEdit size={20} stroke={1.5} />
        </ActionIcon>
        {/* <ActionIcon color="red" onClick={() => removeMedicine(rowData.id)}>
          <IconTrash size={18} />
        </ActionIcon> */}
      </div>
    );
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getAllMedicines();
    getAllMedicines()
      .then(() => {
        setData([...res]);
      })
      .catch((err) => {
        ERROR_NOTIFICATION(
          err.response?.data?.errorMessage || "Error fetching medicines"
        );
      });
  };
  const cancel = () => {
    form.reset();
    setEdit(false);
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
            <Column field="name" header="Name" style={{ minWidth: "14rem" }} />
            <Column
              field="dosage"
              header="Dosage"
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="stock"
              header="Stock"
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="category"
              header="Category"
              style={{ minWidth: "14rem" }}
            />
            <Column field="type" header="Type" style={{ minWidth: "14rem" }} />

            <Column
              field="manufacturer"
              header="Manufacturer"
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="unitPrice"
              header="Unit Price($) "
              sortable
              style={{ minWidth: "14rem" }}
            />

            <Column body={actionBodyTemplate} />
          </DataTable>
        ) : (
          <form onSubmit={form.onSubmit(handleFormSubmit)}>
            {" "}
            <Fieldset
              className="grid gap-4 grid-cols-2"
              legend={
                <span className="text-lg font-medium text-primary-500">
                  Medicine iformation
                </span>
              }
              radius="md"
            >
              <TextInput
                {...form.getInputProps("name")}
                label="Medicine"
                placeholder="Enter medicine name"
                withAsterisk
              />
              <TextInput
                {...form.getInputProps("dosage")}
                label="Dosage"
                placeholder="Enter dosage (50mg,500ml,etx..)"
                withAsterisk
              />
              <Select
                {...form.getInputProps("category")}
                label="Category"
                placeholder="Select category"
                data={medicineCategories}
              />
              <Select
                {...form.getInputProps("type")}
                label="Type"
                placeholder="Select type"
                data={medicineType}
              />
              <TextInput
                {...form.getInputProps("manufacturer")}
                label="Manufacturer"
                placeholder="Enter manufacturer name"
              />
              <NumberInput
                {...form.getInputProps("unitPrice")}
                label="Unit Price"
                min={0}
                clampBehavior="strict"
                placeholder="Enter unit perice"
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
                {form.values?.id ? "Update" : "Add"} medicine
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

export default Medicine;
