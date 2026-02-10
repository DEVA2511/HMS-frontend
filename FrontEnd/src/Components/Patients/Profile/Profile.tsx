import {
  Avatar,
  Button,
  Divider,
  FileButton,
  Modal,
  NumberInput,
  Select,
  Table,
  TagsInput,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconEdit, IconUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bloodGroup, bloodGroups } from "../../../Data/DropDownData";
import { useDisclosure } from "@mantine/hooks";
import {
  getPatient,
  updatePatient,
} from "../../../Service/PatientProfileService";
import { useForm } from "@mantine/form";
import { setuser } from "../../../Slice/UserSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../Utility/Notification";
import { arrayToCSV } from "../../../Utility/OtherUtility";
import { formatDate } from "../../../Utility/FormateDate";
import { getMediaUrl, uploadMedia } from "../../../Service/MediaService";
import { DropzoneButton } from "../../Utility/Dropzine/DropzoneButton";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [editmode, setEditMode] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const [patient, setPatient] = useState<any>(null);
  const form = useForm({
    initialValues: {
      dob: "",
      address: "",
      phoneNumber: undefined as number | undefined,
      aadharNumber: "",
      profilePictureId: null as number | null,
      bloodGroup: "",
      allergies: [] as string[],
      chronicDiseases: [] as string[],
      profilePic: "",
    },
    validate: {
      dob: (value: any) => (!value ? "Date of birth is required" : null),
      address: (value: any) => (!value ? "Address is required" : null),
      phoneNumber: (value: any) =>
        !value
          ? "Phone number is required"
          : value.toString().length < 10
            ? "Phone number must be 10 digits"
            : null,
      aadharNumber: (value: any) =>
        !value ? "Aadhar number is required" : null,
      bloodGroup: (value: any) => (!value ? "Blood group is required" : null),
    },
  });

  // ✅ FETCH PATIENT
  useEffect(() => {
    if (user?.profileId) {
      getPatient(user.profileId)
        .then((data: any) => {
          setPatient({
            ...data,
            allergies: Array.isArray(data.allergies)
              ? arrayToCSV(data.allergies)
              : data.allergies
                ? arrayToCSV(JSON.parse(data.allergies))
                : null,
            chronicDiseases: Array.isArray(data.chronicDiseases)
              ? arrayToCSV(data.chronicDiseases)
              : data.chronicDiseases
                ? arrayToCSV(JSON.parse(data.chronicDiseases))
                : null,
          });

          form.setValues({
            dob: data.dob ?? "",
            address: data.address ?? "",
            phoneNumber: data.phoneNumber
              ? Number(data.phoneNumber)
              : undefined,
            aadharNumber: data.aadharNumber ?? "",
            profilePictureId: data.profilePictureId ?? "",
            bloodGroup: data.bloodGroup ?? "",
            allergies: Array.isArray(data.allergies)
              ? data.allergies
              : data.allergies
                ? JSON.parse(data.allergies)
                : [],
            chronicDiseases: Array.isArray(data.chronicDiseases)
              ? data.chronicDiseases
              : data.chronicDiseases
                ? JSON.parse(data.chronicDiseases)
                : [],
            profilePic: "",
          });
          if (user.profilePictureId !== data.profilePictureId) {
            dispatch(
              setuser({ ...user, profilePictureId: data.profilePictureId })
            );
          }
        })
        .catch(console.log);
    }
  }, [user]);

  if (!patient) {
    return <div className="p-10">Loading...</div>;
  }
  const handleUpload = (data: any) => {
    // data is the response from uploadMedia
    form.setFieldValue("profilePic", getMediaUrl(data.id));
  };

  const handleSubmit = (values: typeof form.values) => {
    updatePatient({
      ...patient,
      ...values,
      allergies: values.allergies ? JSON.stringify(values.allergies) : "[]",
      chronicDiseases: values.chronicDiseases
        ? JSON.stringify(values.chronicDiseases)
        : "[]",
    })
      .then((data: any) => {
        dispatch(setuser({ ...user, ...data, isSynced: true }));
        setPatient({
          ...data,
          allergies: Array.isArray(data.allergies)
            ? arrayToCSV(data.allergies)
            : data.allergies
              ? arrayToCSV(JSON.parse(data.allergies))
              : null,
          chronicDiseases: Array.isArray(data.chronicDiseases)
            ? arrayToCSV(data.chronicDiseases)
            : data.chronicDiseases
              ? arrayToCSV(JSON.parse(data.chronicDiseases))
              : null,
        });
        form.setFieldValue("profilePic", "");
        form.setFieldValue("profilePictureId", data.profilePictureId);
        setEditMode(false);
        SUCCESS_NOTIFICATION("Patient profile updated successfully");
      })
      .catch((error: any) => {
        const msg =
          error?.response?.data?.errorMessage ||
          error?.message ||
          "Update failed";
        ERROR_NOTIFICATION(msg);
      });
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="p-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              variant="filled"
              size={200}
              radius={100}
              src={
                form.values.profilePic || getMediaUrl(patient.profilePictureId)
              }
              alt="Profile"
            >
              {!form.values.profilePic &&
                !patient.profilePictureId &&
                user.name[0]}
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
        <Table.Tbody className="[&_td]:!w-1/2">
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
                formatDate(patient.dob)
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
                patient.address || "-"
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
                  maxLength={10}
                  hideControls
                />
              ) : (
                patient.phoneNumber || "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Aadhar */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">Aadhar Number</Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <NumberInput
                  {...form.getInputProps("aadharNumber")}
                  placeholder="Aadhar Number"
                  maxLength={12}
                  hideControls
                />
              ) : (
                patient.aadharNumber || "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Blood Group */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">Blood Group</Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <Select
                  {...form.getInputProps("bloodGroup")}
                  placeholder="Blood Group"
                  data={bloodGroups}
                />
              ) : (
                bloodGroup[patient.bloodGroup] || "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Allergies */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">Allergies</Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <TagsInput
                  {...form.getInputProps("allergies")}
                  placeholder="Allergies"
                />
              ) : (
                arrayToCSV(patient.allergies)
              )}
            </Table.Td>
          </Table.Tr>

          {/* Chronic Diseases */}
          <Table.Tr>
            <Table.Td className="font-semibold text-xl">
              Chronic Diseases
            </Table.Td>
            <Table.Td className="text-xl">
              {editmode ? (
                <TagsInput
                  {...form.getInputProps("chronicDiseases")}
                  placeholder="Chronic Diseases"
                />
              ) : (
                arrayToCSV(patient.chronicDiseases)
              )}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      {/* Upload Modal */}
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
            onUpload={handleUpload}
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
