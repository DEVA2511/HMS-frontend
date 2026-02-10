import { useEffect, useState } from "react";
import { ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import { getAppointmetsByPatient } from "../../../Service/AppointmentService";

const Appointment = () => {
  const user = useSelector((state: any) => state.user);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user?.id) {
        try {
          const appointments = await getAppointmetsByPatient(user.id);
          // Sort by date to show latest first (descending order)
          const sorted = appointments.sort(
            (a: any, b: any) =>
              new Date(b.appointmentDateTime).getTime() -
              new Date(a.appointmentDateTime).getTime()
          );
          setData(sorted);
        } catch (error) {
          console.error("Error fetching patient appointments:", error);
        }
      }
    };
    fetchAppointments();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
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
            Dr. {app.doctorName || "Unknown Doctor"}
          </div>
          <div className="text-xs px-2 py-0.5 bg-blue-100 rounded-full text-blue-700 font-medium w-fit">
            {app.reason}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-700">
            {formatDate(app.appointmentDateTime)}
          </div>
          <div className="text-xs text-gray-500">
            {formatTime(app.appointmentDateTime)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-xl bg-blue-50/30 shadow-md flex flex-col gap-4">
      <div className="font-bold text-xl text-blue-900 border-b border-blue-200 pb-2">
        My Appointments
      </div>
      <ScrollArea.Autosize mah={300} mx="auto" className="w-full">
        {data.length > 0 ? (
          data.map((appt) => card(appt))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic bg-white/50 rounded-xl">
            No upcoming appointments
          </div>
        )}
      </ScrollArea.Autosize>
    </div>
  );
};

export default Appointment;
