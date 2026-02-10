import React, { useEffect, useState } from "react";
import { ScrollArea } from "@mantine/core";
import { getAllDoctor } from "../../../Service/DoctorProfileService";

const Doctors = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsList = await getAllDoctor();
        setData(doctorsList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchData();
  }, []);

  const card = (app: any) => {
    return (
      <div
        className="p-4 mb-4 border rounded-xl bg-white shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
        key={app.id || app.email}
      >
        <div className="flex flex-col gap-1">
          <div className="font-bold text-gray-800">{app.name}</div>
          <div className="text-sm text-teal-600 font-medium">
            {app.department || "No Department"}
          </div>
        </div>
        <div className="text-right flex flex-col gap-1">
          <div className="text-sm font-semibold text-gray-700">
            {app.location || "No Location"}
          </div>
          <div className="text-xs text-gray-400">{app.email}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-xl bg-teal-50/30 shadow-md flex flex-col gap-4">
      <div className="font-bold text-xl text-teal-900 border-b border-teal-200 pb-2">
        Our Doctors
      </div>
      <ScrollArea.Autosize mah={400} mx="auto" className="w-full">
        {data.length > 0 ? (
          data.map((item) => card(item))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic bg-white/50 rounded-xl">
            No doctors registered yet
          </div>
        )}
      </ScrollArea.Autosize>
    </div>
  );
};

export default Doctors;
