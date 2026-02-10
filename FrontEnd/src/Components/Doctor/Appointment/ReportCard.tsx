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
  IconStethoscope,
} from "@tabler/icons-react";
import { formatDate } from "../../../Utility/FormateDate";

interface ReportCardProps {
  report: {
    id: number;
    doctorName: string;
    diagnosis: string;
    prescriptionDate: string | Date;
    medicines: any[];
    notes: string;
    appointmentId: number;
  };
  onView: (report: any) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onView }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
      <Stack gap="md">
        {/* Header with Medicine Count Badge */}
        <Group justify="space-between" align="flex-start">
          <Badge color="teal" size="lg" variant="filled">
            {report.medicines?.length || 0} Medicines
          </Badge>
          <ActionIcon
            color="blue"
            variant="light"
            onClick={() => onView(report)}
            size="lg"
          >
            <IconEye size={18} stroke={1.5} />
          </ActionIcon>
        </Group>

        {/* Doctor Information */}
        <Group gap="xs" align="flex-start">
          <IconUser size={20} className="text-blue-600 mt-1" />
          <div>
            <Text size="xs" c="dimmed" fw={500}>
              Doctor
            </Text>
            <Text size="md" fw={600}>
              {report.doctorName}
            </Text>
          </div>
        </Group>

        {/* Diagnosis */}
        <Group gap="xs" align="flex-start">
          <IconStethoscope size={20} className="text-purple-600 mt-1" />
          <div className="flex-1">
            <Text size="xs" c="dimmed" fw={500}>
              Diagnosis
            </Text>
            <Text size="md" fw={500} lineClamp={2}>
              {report.diagnosis}
            </Text>
          </div>
        </Group>

        {/* Report Date */}
        <Group gap="xs" align="flex-start">
          <IconCalendar size={20} className="text-green-600 mt-1" />
          <div>
            <Text size="xs" c="dimmed" fw={500}>
              Report Date
            </Text>
            <Text size="md" fw={500}>
              {formatDate(report.prescriptionDate)}
            </Text>
          </div>
        </Group>

        {/* Notes */}
        {report.notes && (
          <>
            <Divider />
            <Group gap="xs" align="flex-start">
              <IconNotes size={20} className="text-orange-600 mt-1" />
              <div className="flex-1">
                <Text size="xs" c="dimmed" fw={500}>
                  Notes
                </Text>
                <Text size="sm" lineClamp={2}>
                  {report.notes}
                </Text>
              </div>
            </Group>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default ReportCard;
