import { useEffect, useState } from "react";
import { ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import { getAppointmetsByDoctor } from "../../../Service/AppointmentService";

const Appointment = () => {
  const user = useSelector((state: any) => state.user);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user?.id) {
        try {
          const appointments = await getAppointmetsByDoctor(user.id);
          const today = new Date().toISOString().split("T")[0];
          const todayList = appointments.filter((appt: any) => {
            const apptDate = appt.appointmentDateTime.split("T")[0];
            return apptDate === today;
          });
          setData(todayList);
        } catch (error) {
          console.error("Error fetching doctor's today appointments:", error);
        }
      }
    };
    fetchAppointments();
  }, [user?.id]);

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const card = (app: any) => {
    return (
      <div
        className="p-4 mb-4 border rounded-xl bg-white shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
        key={app.id}
      >
        <div className="flex flex-col gap-1">
          <div className="font-bold text-gray-800">
            {app.patientName || "Unknown Patient"}
          </div>
          <div className="text-xs px-2 py-0.5 bg-violet-100 rounded-full text-violet-700 font-medium w-fit">
            {app.reason}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-700">
            {formatTime(app.appointmentDateTime)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-xl bg-violet-50 shadow-md flex flex-col gap-4">
      <div className="font-bold text-xl text-violet-900 border-b border-violet-200 pb-2">
        Today's Schedule
      </div>
      <ScrollArea.Autosize mah={300} mx="auto" className="w-full">
        {data.length > 0 ? (
          data.map((appt) => card(appt))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic bg-white/50 rounded-xl">
            No appointments for today
          </div>
        )}
      </ScrollArea.Autosize>
    </div>
  );
};

export default Appointment;
