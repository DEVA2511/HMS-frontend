import { useEffect, useState } from "react";
import { ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import { getMedicineByPatientId } from "../../../Service/AppointmentService";

const Medication = () => {
  const user = useSelector((state: any) => state.user);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedications = async () => {
      if (user?.id) {
        try {
          const meds = await getMedicineByPatientId(user.id);
          setData(meds);
        } catch (error) {
          console.error("Error fetching patient medications:", error);
        }
      }
    };
    fetchMedications();
  }, [user?.id]);

  const card = (med: any) => {
    return (
      <div
        className="p-4 mb-4 border rounded-xl bg-white shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
        key={med.id || med.name}
      >
        <div className="flex flex-col gap-1">
          <div className="font-bold text-gray-800">
            {med.brandName || med.name}
          </div>
          <div className="text-xs text-gray-500">{med.manufacturer}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-violet-700">{med.dosage}</div>
          {/* <div className="text-xs text-gray-400">Prescribed by {med.doctorName || "Doctor"}</div> */}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-xl bg-violet-50/30 shadow-md flex flex-col gap-4">
      <div className="font-bold text-xl text-violet-900 border-b border-violet-200 pb-2">
        Active Medications
      </div>
      <ScrollArea.Autosize mah={300} mx="auto" className="w-full">
        {data.length > 0 ? (
          data.map((med) => card(med))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic bg-white/50 rounded-xl">
            No active medications
          </div>
        )}
      </ScrollArea.Autosize>
    </div>
  );
};

export default Medication;
