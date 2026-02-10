import {
  Avatar,
  Button,
  Divider,
  Modal,
  NumberInput,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  doctorDepatment,
  doctorSpecialization,
} from "../../../Data/DropDownData";
import { useDisclosure } from "@mantine/hooks";
import { getDoctor, updateDoctor } from "../../../Service/DoctorProfileService";
import { useForm } from "@mantine/form";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../Utility/Notification";
import { formatDate } from "../../../Utility/FormateDate";
import { getMediaUrl } from "../../../Service/MediaService";
import { setuser } from "../../../Slice/UserSlice";
import { useDispatch } from "react-redux";
import { DropzoneButton } from "../../Utility/Dropzine/DropzoneButton";

// Doctor Profile
const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [editmode, setEditMode] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [doctor, setDoctor] = useState<any>(null);

  const form = useForm({
    initialValues: {
      dob: "",
      address: "",
      phoneNumber: undefined as number | undefined,
      licenseNumber: "",
      specialization: "",
      department: "",
      totalExperience: 0,
      profilePic: "",
      profilePictureId: null as number | null,
    },
    validate: {
      dob: (value: any) => (!value ? "Date of birth is required" : null),
      address: (value: any) => (!value ? "Address is required" : null),
      phoneNumber: (value: any) =>
        !value
          ? "Phone number is required"
          : value.length < 10
            ? "Phone number must be at least 10 Number"
            : null,
      licenseNumber: (value: any) =>
        !value ? "License number is required" : null,

      department: (value: any) => (!value ? "Department is required" : null),
    },
  });
  useEffect(() => {
    if (user?.profileId) {
      getDoctor(user.profileId)
        .then((data: any) => {
          setDoctor(data);

          form.setValues({
            dob: data.dob ?? "",
            address: data.address ?? "",
            phoneNumber: data.phoneNumber
              ? Number(data.phoneNumber)
              : undefined,
            licenseNumber: data.licenseNumber ?? "",
            specialization: data.specialization ?? "",
            department: data.department ?? "",
            totalExperience: data.totalExperience ?? 0,
            profilePic: "",
            profilePictureId: data.profilePictureId ?? null,
          });
          if (user.profilePictureId !== data.profilePictureId) {
            dispatch(
              setuser({ ...user, profilePictureId: data.profilePictureId })
            );
          }
        })
        .catch(console.log);
    }
  }, [user, dispatch, form]);
  if (!doctor) {
    return <div className="p-10">Loading...</div>;
  }

  const handleSubmit = (values: typeof form.values) => {
    updateDoctor({ ...doctor, ...values })
      .then((data: any) => {
        dispatch(setuser({ ...user, ...data, isSynced: true }));
        setDoctor(data);
        form.setFieldValue("profilePic", "");
        form.setFieldValue("profilePictureId", data.profilePictureId);
        setEditMode(false);
        SUCCESS_NOTIFICATION("Doctor profile updated successfully");
      })
      .catch((error) => {
        const message =
          error?.response?.data?.errorMessage ||
          error?.response?.data?.message ||
          error?.message ||
          "Update failed";

        ERROR_NOTIFICATION(message);
      });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="p-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <div className="flex flex-col items-start gap-3">
            <Avatar
              variant="filled"
              size={200}
              radius={100}
              src={
                form.values.profilePic || getMediaUrl(doctor.profilePictureId)
              }
              alt="Doctor"
            >
              {!form.values.profilePic &&
                !doctor.profilePictureId &&
                user.name?.[0]}
            </Avatar>
            {editmode && (
              <Button type="button" size="sm" onClick={open}>
                Upload
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-3xl font-medium">{user.name}</div>
            <div className="text-xl text-gray-600">{user.email}</div>
          </div>
        </div>

        {!editmode ? (
          <Button
            key="edit-button"
            type="button"
            size="lg"
            leftSection={<IconEdit />}
            onClick={(e) => {
              e.preventDefault();
              setEditMode(true);
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <Button
            key="submit-button"
            type="submit"
            size="lg"
            leftSection={<IconEdit />}
          >
            Submit
          </Button>
        )}
      </div>

      <Divider my="xl" />

      {/* Personal Info */}
      <div className="text-2xl font-medium mb-4">Personal Information</div>

      <Table striped stripedColor="primary.1" verticalSpacing="md">
        <Table.Tbody>
          {/* DOB */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">Date of Birth</Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <DateInput
                  {...form.getInputProps("dob")}
                  placeholder="Date of Birth"
                />
              ) : (
                formatDate(doctor.dob)
              )}
            </Table.Td>
          </Table.Tr>

          {/* Address */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">Address</Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <TextInput
                  {...form.getInputProps("address")}
                  placeholder="Address"
                />
              ) : (
                doctor.address || "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Phone */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">Phone Number</Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <NumberInput
                  {...form.getInputProps("phoneNumber")}
                  placeholder="Phone Number"
                  // size="lg"
                  maxLength={10}
                  hideControls
                />
              ) : (
                doctor.phoneNumber || "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* License */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">
              License Number
            </Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <TextInput
                  {...form.getInputProps("licenseNumber")}
                  placeholder="License Number"
                />
              ) : (
                doctor.licenseNumber || "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Specialization */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">
              Specialization
            </Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <Select
                  {...form.getInputProps("specialization")}
                  placeholder="Specialization"
                  data={doctorSpecialization}
                />
              ) : (
                doctor.specialization || "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Department */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">Department</Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <Select
                  {...form.getInputProps("department")}
                  placeholder="Department"
                  data={doctorDepatment}
                />
              ) : (
                doctor.department || "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Experience */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">
              Total Experience
            </Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <NumberInput
                  {...form.getInputProps("totalExperience")}
                  placeholder="Total Experience"
                  hideControls
                  max={30}
                />
              ) : doctor.totalExperience ? (
                `${doctor.totalExperience} Years`
              ) : (
                "-"
              )}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Modal
        centered
        opened={opened}
        onClose={close}
        title={
          <span className="text-xl font-medium">Upload profile image</span>
        }
      >
        <div className="flex flex-col gap-4">
          <DropzoneButton
            onUpload={(data: any) => {
              form.setFieldValue("profilePic", getMediaUrl(data.id));
            }}
            form={form}
            id="profilePictureId"
          />
          <Button fullWidth variant="light" onClick={close}>
            Done
          </Button>
        </div>
      </Modal>
    </form>
  );
};

export default Profile;
