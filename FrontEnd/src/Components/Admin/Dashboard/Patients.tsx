import { useEffect, useState } from "react";
import { ScrollArea } from "@mantine/core";
import { getAllPatients } from "../../../Service/PatientProfileService";

const Patients = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsList = await getAllPatients();
        setData(patientsList);
      } catch (error) {
        console.error("Error fetching patients:", error);
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
          <div className="text-sm text-gray-500 font-medium">{app.email}</div>
        </div>
        <div className="text-right flex flex-col gap-1">
          <div className="text-sm font-semibold text-blue-600">
            {app.phone || "No Phone"}
          </div>
          <div className="text-xs text-gray-400 truncate max-w-[150px]">
            {app.address || "No Address"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-xl bg-blue-50/30 shadow-md flex flex-col gap-4">
      <div className="font-bold text-xl text-blue-900 border-b border-blue-200 pb-2">
        Latest Patients
      </div>
      <ScrollArea.Autosize mah={400} mx="auto" className="w-full">
        {data.length > 0 ? (
          data.map((item) => card(item))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic bg-white/50 rounded-xl">
            No patients registered yet
          </div>
        )}
      </ScrollArea.Autosize>
    </div>
  );
};

export default Patients;
