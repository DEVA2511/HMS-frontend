import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";

import {
  ActionIcon,
  Button,
  LoadingOverlay,
  Modal,
  SegmentedControl,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { Tag } from "primereact/tag";
import {
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
  IconLayoutGrid,
  IconList,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { getDoctorDropDown } from "../../../Service/DoctorProfileService";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { appointmentReason } from "../../../Data/DropDownData";
import { useSelector } from "react-redux";
import {
  cancelAppointment,
  getAppointmetsByPatient,
  scheduleAppointment,
  updateAppointment,
} from "../../../Service/AppointmentService";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../Utility/Notification";
import { formatDateTime } from "../../../Utility/FormateDate";
import { modals } from "@mantine/modals";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toolbar } from "primereact/toolbar";
import ApCard from "./ApCard";

interface Customer {
  id: number;
  doctorName: string;
  doctorId: number;
  patientId: number;
  appointmentDateTime: string | Date;
  reason: string;
  status: string;
  notes: string;
}

export default function PatientAppointment() {
  const [opened, { open, close }] = useDisclosure(false);
  const [tab, setTab] = useState("Today");
  const [viewMode, setViewMode] = useState<"list" | "card">("list"); // Add view mode state
  const [doctor, setDoctor] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  const user = useSelector((state: any) => state.user);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    doctorName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    appointmentDateTime: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    reason: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

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
        setDoctor(
          response.map((doc: any) => ({
            value: "" + doc.id,
            label: doc.name,
          }))
        );
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []);

  const fetchData = () => {
    if (!user.profileId) return;
    setLoading(true);
    getAppointmetsByPatient(user.profileId)
      .then((response: any) => {
        setAppointments(response || []);
      })
      .catch((error: any) => {
        console.error(error);
        ERROR_NOTIFICATION("Appointments Fetched Failed");
      })
      .finally(() => {
        setLoading(false);
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
      appointmentDateTime: new Date(),
      reason: "",
      notes: "",
    },
    validate: {
      doctorId: (value: any) => (value ? null : "Doctor is required"),
      appointmentDateTime: (value: any) =>
        value ? null : "Appointment Time is required",
      reason: (value: any) => (value ? null : "Reason is required"),
    },
  });

  const handleEdit = (rowData: any) => {
    setEditingId(rowData.id);
    form.setValues({
      doctorId: "" + rowData.doctorId,
      patientId: rowData.patientId,
      appointmentDateTime: new Date(rowData.appointmentDateTime),
      reason: rowData.reason,
      notes: rowData.notes || "",
    });
    fetchData();
    open();
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
            fetchData();
          })
          .catch((error) => {
            ERROR_NOTIFICATION(
              error.response?.data?.errorMessage ||
                "Failed to cancel appointment"
            );
          });
      },
    });
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    const payload = {
      ...values,
      id: editingId,
      appointmentDateTime: values.appointmentDateTime
        ? new Date(values.appointmentDateTime).toISOString()
        : null,
    };

    const action = editingId
      ? updateAppointment(payload)
      : scheduleAppointment(payload);

    action
      .then(() => {
        close();
        form.reset();
        setEditingId(null);
        fetchData();
        SUCCESS_NOTIFICATION(
          editingId
            ? "Appointment Updated Successfully"
            : "Appointment Scheduled Successfully"
        );
      })
      .catch((error) => {
        console.error(error);
        ERROR_NOTIFICATION(
          editingId
            ? "Failed to update appointment"
            : "Failed to schedule appointment"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const statusBodyTemplate = (rowData: any) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon color="blue" onClick={() => handleEdit(rowData)}>
          <IconEdit size={20} stroke={1.5} />
        </ActionIcon>
        <ActionIcon color="red" onClick={() => handleDelete(rowData)}>
          <IconTrash size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    );
  };

  const timeTemplate = (rowData: any) => {
    return <span>{formatDateTime(rowData.appointmentDateTime)}</span>;
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <Button
          onClick={() => {
            form.reset();
            setEditingId(null);
            open();
          }}
          leftSection={<IconPlus />}
          variant="filled"
        >
          Schedule Appointment
        </Button>
      </div>
    );
  };

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

  const centerToolBarTemplate = () => {
    return (
      <SegmentedControl
        value={tab}
        onChange={setTab}
        variant="filled"
        color={
          tab === "Today" ? "primary" : tab === "Upcoming" ? "green" : "red"
        }
        data={["Today", "Upcoming", "Past"]}
      />
    );
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDateTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDay = new Date(appointmentDate);
    appointmentDay.setHours(0, 0, 0, 0);
    if (tab === "Today") return appointmentDay.getTime() === today.getTime();
    if (tab === "Upcoming") return appointmentDay.getTime() > today.getTime();
    if (tab === "Past") return appointmentDay.getTime() < today.getTime();
    return true;
  });

  return (
    <div className="card">
      <Toolbar
        className="mb-4"
        start={leftToolbarTemplate}
        center={centerToolBarTemplate}
        end={rightToolbarTemplate}
      />

      {/* Conditional Rendering: Card View or List View */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <ApCard
                key={appointment.id}
                appointment={appointment}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <Text c="dimmed" size="lg">
                No appointments found.
              </Text>
            </div>
          )}
        </div>
      ) : (
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
          onSelectionChange={(e) => setSelectedCustomers(e.value)}
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
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column
            field="doctorName"
            header="Doctor"
            sortable
            filter
            filterPlaceholder="Search by Doctor"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="appointmentDateTime"
            header="Date & Time"
            sortable
            filter
            body={timeTemplate}
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="reason"
            header="Reason"
            sortable
            filter
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="notes"
            header="Notes"
            sortable
            filter
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="status"
            header="Status"
            sortable
            filter
            body={statusBodyTemplate}
            style={{ minWidth: "12rem" }}
          />
          <Column
            body={actionBodyTemplate}
            headerStyle={{ width: "8rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center" }}
          />
        </DataTable>
      )}

      <Modal
        opened={opened}
        onClose={() => {
          close();
          form.reset();
          setEditingId(null);
        }}
        size="lg"
        title={
          <div className="text-primary-500 font-bold">
            {editingId ? "Edit Appointment" : "Schedule Appointment"}
          </div>
        }
        centered
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <Select
              {...form.getInputProps("doctorId")}
              withAsterisk
              data={doctor}
              label="Doctor"
              placeholder="Select Doctor"
              searchable
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
              label="Reason"
              placeholder="Select reason"
            />
            <Textarea
              {...form.getInputProps("notes")}
              label="Additional Notes"
              placeholder="Enter any notes..."
            />
            <Button type="submit" variant="filled" fullWidth mt="md">
              {editingId ? "Update" : "Schedule"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
