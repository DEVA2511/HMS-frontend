import React, { useEffect, useState } from "react";
import { ScrollArea } from "@mantine/core";
import { getTodayAppointments } from "../../../Service/AppointmentService";

const Appointment = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const todayAppointments = await getTodayAppointments();
        setData(todayAppointments);
      } catch (error) {
        console.error("Error fetching today's appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

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
          <div className="text-sm text-blue-600 font-medium">
            {app.doctorName || "Unknown Doctor"}
          </div>
        </div>
        <div className="text-right flex flex-col gap-1">
          <div className="text-sm font-semibold text-gray-700">
            {formatTime(app.appointmentDateTime)}
          </div>
          <div className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
            {app.reason}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-xl bg-violet-50 shadow-md flex flex-col gap-4">
      <div className="font-bold text-xl text-violet-900 border-b border-violet-200 pb-2">
        Today's Appointments
      </div>
      <ScrollArea.Autosize mah={400} mx="auto" className="w-full">
        {data.length > 0 ? (
          data.map((appt: any) => card(appt))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic bg-white/50 rounded-xl">
            No appointments scheduled for today
          </div>
        )}
      </ScrollArea.Autosize>
    </div>
  );
};

export default Appointment;
