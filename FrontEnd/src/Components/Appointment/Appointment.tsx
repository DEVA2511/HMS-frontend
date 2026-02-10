import { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";

import {
  ActionIcon,
  Button,
  LoadingOverlay,
  Modal,
  SegmentedControl,
  Select,
  Text,
  Textarea,
} from "@mantine/core";

import { Tag } from "primereact/tag";
import { TextInput } from "@mantine/core";
import { IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { getDoctorDropDown } from "../../Service/DoctorProfileService";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { appointmentReason } from "../../Data/DropDownData";
import { useSelector } from "react-redux";
import {
  cancelAppointment,
  getAppointmetsByPatient,
  scheduleAppointment,
} from "../../Service/AppointmentService";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../Utility/Notification";
import { formatDateTime } from "../../Utility/FormateDate";
import { modals } from "@mantine/modals";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toolbar } from "primereact/toolbar";

interface Customer {
  id: number;
  name: string;

  company: string;
  date: string | Date;
  status: string;
  verified: boolean;
  activity: number;

  balance: number;
}

export default function Appointment() {
  const [opened, { open, close }] = useDisclosure(false);
  const [tab, setTab] = useState("Today");
  const [doctor, setDcotor] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [appointmetns, setAppointments] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const user = useSelector((state: any) => state.user);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    doctorName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    appointmentDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    resaon: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    notes: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const getSeverity = (status: string) => {
    switch (status) {
      case "CANCELLED":
        return "danger";

      case "COMPLETED":
        return "success";

      case "SCHEDULED":
        return "info";

      default:
        return null;
    }
  };

  useEffect(() => {
    fetchData();

    getDoctorDropDown()
      .then((response: any) => {
        setDcotor(
          response.map((doctor: any) => ({
            value: "" + doctor.id,
            label: doctor.name,
          }))
        );
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = () => {
    getAppointmetsByPatient(user.profileId)
      .then((response: any) => {
        console.log(response);
        setAppointments(getCustomers(response));
        SUCCESS_NOTIFICATION("Appointments Fetched Successfully");
      })
      .catch((error: any) => {
        console.log(error);
        ERROR_NOTIFICATION("Appointments Fetched Failed");
      });
  };
  const getCustomers = (data: Customer[]) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      return d;
    });
  };

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
      doctorId: "",
      patientId: user.profileId,
      appointmentDateTime: new Date() || null,
      reason: "",
      notes: "",
    },

    validate: {
      doctorId: (value: any) => (value ? null : "Doctor is required"),
      patientId: (value: any) => (value ? null : "Patient is required"),
      appointmentDateTime: (value: any) =>
        value ? null : "Appointment Time is required",
      reason: (value: any) => (value ? null : "Reason is required"),
    },
  });

  const statusBodyTemplate = (rowData: Customer) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const handleDelete = (rowData: any) => {
    modals.openConfirmModal({
      title: (
        <span className="text-xl font-semibold font-serif">Are you sure</span>
      ),
      centered: true,
      children: (
        <Text size="sm">
          You want to cancel the appointment, action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        cancelAppointment(rowData.id)
          .then(() => {
            SUCCESS_NOTIFICATION("Appointment Cancelled Successfully");
            setAppointments(
              appointmetns.map((appointment) =>
                appointment.id == rowData.id
                  ? { ...appointment, status: "CANCELLED" }
                  : appointment
              )
            );
          })
          .catch((error) => {
            ERROR_NOTIFICATION(
              error.response.data.errorMessage || "Failed to cancel appointment"
            );
          });
      },
    });
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon>
          <IconEdit size={20} stroke={1.5} />
        </ActionIcon>
        <ActionIcon color="red" onClick={() => handleDelete(rowData)}>
          <IconTrash size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    );
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    const payload = {
      ...values,
      appointmentDateTime: values.appointmentDateTime
        ? new Date(values.appointmentDateTime).toISOString()
        : null,
    };

    scheduleAppointment(payload)
      .then(() => {
        close();
        form.reset();
        fetchData();
        SUCCESS_NOTIFICATION("Appointment Scheduled Successfully");
      })
      .catch(() => {
        ERROR_NOTIFICATION("Failed to schedule appointment");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const timeTemplate = (rowData: any) => {
    return <span>{formatDateTime(rowData.appointmentDateTime)}</span>;
  };

  const leftToolbarTemplate = () => {
    return (
      <div>
        {" "}
        <Button onClick={open} leftSection={<IconPlus />} variant="filled">
          Shudule Appointment
        </Button>
      </div>
    );
  };
  const rightToolbarTemplate = () => {
    return (
      <TextInput
        leftSection={<IconSearch />}
        fw={500}
        value={globalFilterValue}
        onChange={onGlobalFilterChange}
        placeholder="Keyword Search"
      />
    );
  };
  const centerToolBarTemplate = () => {
    return (
      <SegmentedControl
        value={tab}
        onChange={setTab}
        variant="filled"
        color={
          tab === "Today" ? "primary" : tab === "upcoming" ? "green" : "red"
        }
        data={["Today", "Upcoming", "Past"]}
      />
    );
  };
  const filteredAppointments = appointmetns.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDateTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDay = new Date(appointmentDate);
    appointmentDay.setHours(0, 0, 0, 0);
    if (tab === "Today") {
      return appointmentDay.getTime() === today.getTime();
    } else if (tab === "Upcoming") {
      return appointmentDay.getTime() > today.getTime();
    } else if (tab === "Past") {
      return appointmentDay.getTime() < today.getTime();
    }
    return true;
  });
  return (
    <div className="card">
      <Toolbar
        className="mb-4"
        start={leftToolbarTemplate}
        center={centerToolBarTemplate}
        end={rightToolbarTemplate}
      ></Toolbar>
      <DataTable
        value={filteredAppointments}
        stripedRows
        paginator
        size="small"
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedCustomers}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "doctorName",
          "reason",
          "appointmentDateTime",
          "notes",
          "status",
        ]}
        emptyMessage="No appointments found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column
          field="doctorName"
          header="Doctor"
          sortable
          filter
          filterPlaceholder="Search by DoctorName"
          style={{ minWidth: "14rem" }}
        />
        <Column
          field="appointmentDateTime"
          header="AppointmentDateTime"
          sortable
          filter
          filterPlaceholder="Search by AppointmentDate"
          style={{ minWidth: "14rem" }}
          body={timeTemplate}
        />
        <Column
          field="reason"
          header="Reason"
          sortable
          filter
          filterPlaceholder="Search by Rsason"
          style={{ minWidth: "14rem" }}
        />
        <Column
          field="notes"
          header="Note"
          sortable
          filter
          filterPlaceholder="Search by Notes"
          style={{ minWidth: "14rem" }}
        />
        <Column
          field="status"
          header="Status"
          sortable
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
          body={statusBodyTemplate}
        />
        <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionBodyTemplate}
        />
      </DataTable>
      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        title={<div className="text-primary-500">Shudule Appointment</div>}
        centered
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {" "}
          <div className="grid grid-cols-1 gap-4">
            <Select
              {...form.getInputProps("doctorId")}
              withAsterisk
              data={doctor}
              label="Doctor"
              placeholder="Select Doctor"
            />
            <DateTimePicker
              {...form.getInputProps("appointmentDateTime")}
              withAsterisk
              minDate={new Date()}
              label="Appointment Time"
              placeholder="Pick date and time"
            />
            <Select
              {...form.getInputProps("reason")}
              data={appointmentReason}
              withAsterisk
              label="Reson for Appointment"
              placeholder="Enter reason"
              type="text"
            />
            <Textarea
              {...form.getInputProps("notes")}
              withAsterisk
              label="Aditional Note"
              placeholder="Enter any aditional note"
            />
            <Button type="submit" variant="filled" fullWidth>
              Submit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
