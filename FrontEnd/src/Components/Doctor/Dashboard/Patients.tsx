import { useEffect, useState } from "react";
import { ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import { getAppointmetsByDoctor } from "../../../Service/AppointmentService";

const Patients = () => {
  const user = useSelector((state: any) => state.user);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const appointments = await getAppointmetsByDoctor(user.id);
          // Get unique patients by patientId
          const uniquePatientsMap = new Map();
          appointments.forEach((appt: any) => {
            if (!uniquePatientsMap.has(appt.patientId)) {
              uniquePatientsMap.set(appt.patientId, {
                id: appt.patientId,
                name: appt.patientName,
                email: appt.patientEmail,
                phone: appt.patientPhoneNumber,
                address: appt.notes, // Fallback info
              });
            }
          });
          setData(Array.from(uniquePatientsMap.values()));
        } catch (error) {
          console.error("Error fetching unique patients for doctor:", error);
        }
      }
    };
    fetchData();
  }, [user?.id]);

  const card = (app: any) => {
    return (
      <div
        className="p-3 mb-3 border rounded-xl bg-white shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
        key={app.id || app.email}
      >
        <div>
          <div className="font-bold text-gray-800">
            {app.name || "Unknown Patient"}
          </div>
          <div className="text-xs text-gray-500">{app.email || "No Email"}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-red-600">
            {app.phone || "No Phone"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-xl bg-red-50/30 shadow-md flex flex-col gap-4">
      <div className="font-bold text-xl text-red-900 border-b border-red-200 pb-2">
        My Patients
      </div>
      <ScrollArea.Autosize mah={300} mx="auto" className="w-full">
        {data.length > 0 ? (
          data.map((item) => card(item))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic bg-white/50 rounded-xl">
            No patients assigned yet
          </div>
        )}
      </ScrollArea.Autosize>
    </div>
  );
};

export default Patients;
