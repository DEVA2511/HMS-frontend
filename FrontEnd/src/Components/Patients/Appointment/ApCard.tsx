import React from "react";
import { Card, Badge, ActionIcon, Text, Group, Stack } from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconCalendar,
  IconUser,
  IconNotes,
} from "@tabler/icons-react";
import { formatDateTime } from "../../../Utility/FormateDate";

interface ApCardProps {
  appointment: {
    id: number;
    doctorName: string;
    doctorId: number;
    patientId: number;
    appointmentDateTime: string | Date;
    reason: string;
    status: string;
    notes: string;
  };
  onEdit: (appointment: any) => void;
  onDelete: (appointment: any) => void;
}

const ApCard: React.FC<ApCardProps> = ({ appointment, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CANCELLED":
        return "red";
      case "COMPLETED":
        return "green";
      case "SCHEDULED":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
      <Stack gap="md">
        {/* Header with Status Badge */}
        <Group justify="space-between" align="flex-start">
          <Badge
            color={getStatusColor(appointment.status)}
            size="lg"
            variant="filled"
          >
            {appointment.status}
          </Badge>
          <Group gap="xs">
            <ActionIcon
              color="blue"
              variant="light"
              onClick={() => onEdit(appointment)}
              size="lg"
            >
              <IconEdit size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              color="red"
              variant="light"
              onClick={() => onDelete(appointment)}
              size="lg"
            >
              <IconTrash size={18} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Doctor Information */}
        <Group gap="xs" align="flex-start">
          <IconUser size={20} className="text-blue-600 mt-1" />
          <div>
            <Text size="xs" c="dimmed" fw={500}>
              Doctor
            </Text>
            <Text size="md" fw={600}>
              {appointment.doctorName}
            </Text>
          </div>
        </Group>

        {/* Appointment Date & Time */}
        <Group gap="xs" align="flex-start">
          <IconCalendar size={20} className="text-green-600 mt-1" />
          <div>
            <Text size="xs" c="dimmed" fw={500}>
              Date & Time
            </Text>
            <Text size="md" fw={500}>
              {formatDateTime(appointment.appointmentDateTime)}
            </Text>
          </div>
        </Group>

        {/* Reason */}
        <div>
          <Text size="xs" c="dimmed" fw={500} mb={4}>
            Reason
          </Text>
          <Badge color="cyan" variant="light" size="md">
            {appointment.reason}
          </Badge>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <Group gap="xs" align="flex-start">
            <IconNotes size={20} className="text-orange-600 mt-1" />
            <div className="flex-1">
              <Text size="xs" c="dimmed" fw={500}>
                Notes
              </Text>
              <Text size="sm" lineClamp={2}>
                {appointment.notes}
              </Text>
            </div>
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default ApCard;
