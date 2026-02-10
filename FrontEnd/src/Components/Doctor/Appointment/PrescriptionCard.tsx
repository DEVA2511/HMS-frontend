import {
  Card,
  Badge,
  ActionIcon,
  Text,
  Group,
  Stack,
  Divider,
} from "@mantine/core";
import {
  IconEye,
  IconCalendar,
  IconUser,
  IconNotes,
  IconPill,
} from "@tabler/icons-react";
import { formatDate } from "../../../Utility/FormateDate";

interface PrescriptionCardProps {
  prescription: {
    id: number;
    doctorName: string;
    prescriptionDate: string | Date;
    medicines: any[];
    notes: string;
    appointmentId: number;
  };
  onView: (prescription: any) => void;
  onViewMedicines: (medicines: any[]) => void;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onView,
  onViewMedicines,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
      <Stack gap="md">
        {/* Header with Medicine Count Badge */}
        <Group justify="space-between" align="flex-start">
          <Badge color="blue" size="lg" variant="filled">
            {prescription.medicines?.length || 0} Medicines
          </Badge>
          <Group gap="xs">
            <ActionIcon
              color="blue"
              variant="light"
              onClick={() => onView(prescription)}
              size="lg"
            >
              <IconEye size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              color="green"
              variant="light"
              onClick={() => onViewMedicines(prescription.medicines)}
              size="lg"
            >
              <IconPill size={18} stroke={1.5} />
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
              {prescription.doctorName}
            </Text>
          </div>
        </Group>

        {/* Prescription Date */}
        <Group gap="xs" align="flex-start">
          <IconCalendar size={20} className="text-green-600 mt-1" />
          <div>
            <Text size="xs" c="dimmed" fw={500}>
              Prescription Date
            </Text>
            <Text size="md" fw={500}>
              {formatDate(prescription.prescriptionDate)}
            </Text>
          </div>
        </Group>

        {/* Notes */}
        {prescription.notes && (
          <>
            <Divider />
            <Group gap="xs" align="flex-start">
              <IconNotes size={20} className="text-orange-600 mt-1" />
              <div className="flex-1">
                <Text size="xs" c="dimmed" fw={500}>
                  Notes
                </Text>
                <Text size="sm" lineClamp={2}>
                  {prescription.notes}
                </Text>
              </div>
            </Group>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default PrescriptionCard;
