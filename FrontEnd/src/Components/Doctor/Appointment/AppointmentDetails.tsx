import { Breadcrumbs, Tabs, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAppointmentDetails } from "../../../Service/AppointmentService";
import { Card, Group, Badge, Divider } from "@mantine/core";
import {
  IconStethoscope,
  IconClipboardHeart,
  IconVaccine,
} from "@tabler/icons-react";
import { formatDateTime } from "../../../Utility/FormateDate";
import ApReport from "./ApReport";
import Prescription from "./Prescription";

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointments] = useState<any>({});

  useEffect(() => {
    if (!id) return;

    getAppointmentDetails(id)
      .then((res) => {
        console.log("Appointment details:", res);
        setAppointments(res);
      })
      .catch((err) => console.error("Error fetching appointment:", err));
  }, [id]);

  return (
    <div>
      <Breadcrumbs mb="md">
        <Link
          className="text-primary-400 hover:underline"
          to="/doctor/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="text-primary-400 hover:underline"
          to="/doctor/appointments"
        >
          Appointments
        </Link>
        <Text>Details</Text>
      </Breadcrumbs>

      <Card shadow="md" radius="lg" withBorder p="lg">
        {/* Header */}
        <Group justify="space-between" mb="sm">
          <Title order={2}>{appointment.patientName}</Title>

          <Badge
            color={appointment.status === "CANCELLED" ? "red" : "green"}
            variant="filled"
          >
            {appointment.status}
          </Badge>
        </Group>

        <Divider my="sm" />

        {/* Patient Details */}
        <div className="grid grid-cols-2 gap-6">
          <Group>
            <Text>
              <b>Email:</b> {appointment.patientEmail}
            </Text>
          </Group>

          <Group>
            <Text>
              <b>Phone</b>
              {appointment.patientPhoneNumber}
            </Text>
          </Group>
        </div>

        {/* Doctor & Appointment Info */}
        <div className="grid grid-cols-2 gap-6 mb-5">
          <Group>
            <Text>
              <b>Reason:</b> {appointment.reason}
            </Text>
          </Group>

          <Group>
            <Text>
              <b>Appointment Date:</b>{" "}
              {formatDateTime(appointment.appointmentDateTime)}
            </Text>
          </Group>
        </div>

        <div>
          <Text mt="sm" color="dimmed">
            <strong>Notes:</strong> {appointment.notes}
          </Text>
        </div>
      </Card>

      <Tabs my="md" variant="pills" radius="md" defaultValue="medicalhistory">
        <Tabs.List>
          <Tabs.Tab
            value="medicalhistory"
            leftSection={<IconStethoscope size={20} />}
          >
            Medical History
          </Tabs.Tab>
          <Tabs.Tab
            value="prescription"
            leftSection={<IconVaccine size={20} />}
          >
            Prescriptions{" "}
          </Tabs.Tab>
          <Tabs.Tab
            value="report"
            leftSection={<IconClipboardHeart size={20} />}
          >
            Report
          </Tabs.Tab>
        </Tabs.List>
        <Divider my="md" />
        <Tabs.Panel value="medicalhistory">Medical</Tabs.Panel>

        <Tabs.Panel value="prescription">
          {appointment?.id && <Prescription appointment={appointment} />}
        </Tabs.Panel>

        <Tabs.Panel value="report">
          {appointment?.id && <ApReport appointment={appointment} />}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default AppointmentDetails;
