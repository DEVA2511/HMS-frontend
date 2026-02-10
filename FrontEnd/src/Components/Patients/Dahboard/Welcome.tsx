import { Avatar, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMediaUrl } from "../../../Service/MediaService";
import {
  getAppointmetsByPatient,
  getMedicineByPatientId,
} from "../../../Service/AppointmentService";
import { bloodGroupMap } from "../../../Data/DropDownData";

const Welcome = () => {
  const user = useSelector((state: any) => state.user);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const appts = await getAppointmetsByPatient(user.id);
          setAppointments(appts);
          const meds = await getMedicineByPatientId(user.id);
          setMedications(meds);
        } catch (error) {
          console.error("Error fetching patient welcome metrics:", error);
        }
      }
    };
    fetchData();
  }, [user?.id]);

  return (
    <div className="p-5 border shadow-lg rounded-xl bg-blue-50 flex flex-col gap-3 justify-between">
      <div className="flex justify-between items-center">
        <div className="  items-center">
          <Title order={2} className=" font-light text-2xl mb-1 text-gray-600">
            Welcome back,
          </Title>
          <Title order={1} className="text-3xl text-blue-900 font-bold mb-2">
            {user.name || "User"}
          </Title>
          <Text size="lg" className="font-medium text-blue-700">
            {bloodGroupMap[user.bloodGroup] || ""}
          </Text>
        </div>

        <div className="">
          <Avatar
            src={getMediaUrl(user.profilePictureId)}
            size={120}
            variant="filled"
            radius={100}
            className="border-4 border-white shadow-md"
          >
            {user.name?.[0]}
          </Avatar>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="p-3 rounded-xl bg-orange-200">
          <div className="text-sm">Total Visits</div>
          <div className="text-lg font-semibold text-orange-900">
            {appointments.length}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-green-200">
          <div className="text-sm">Medications</div>
          <div className="text-lg font-semibold text-green-900">
            {medications.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
