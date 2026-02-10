import React, { useEffect, useState } from "react";
import { ScrollArea } from "@mantine/core";
import { getAllMedicines } from "../../../Service/MedicineService";

const Medicines = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medicinesList = await getAllMedicines();
        setData(medicinesList);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchData();
  }, []);

  const card = (app: any) => {
    return (
      <div
        className="p-4 mb-4 border rounded-xl bg-white shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
        key={app.id || app.name}
      >
        <div className="flex flex-col gap-1">
          <div className="font-bold text-gray-800">{app.name}</div>
          <div className="text-sm text-amber-600 font-medium">
            {app.manufacturer || "No Manufacturer"}
          </div>
        </div>
        <div className="text-right flex flex-col gap-1">
          <div className="text-sm font-semibold text-gray-700">
            {app.dosage || "No Dosage"}
          </div>
          <div className="text-xs px-2 py-0.5 bg-amber-100 rounded-full text-amber-700 font-bold">
            Stock: {app.stock}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-xl bg-amber-50/30 shadow-md flex flex-col gap-4">
      <div className="font-bold text-xl text-amber-900 border-b border-amber-200 pb-2">
        Inventory Status
      </div>
      <ScrollArea.Autosize mah={400} mx="auto" className="w-full">
        {data.length > 0 ? (
          data.map((item) => card(item))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic bg-white/50 rounded-xl">
            No medicines in stock
          </div>
        )}
      </ScrollArea.Autosize>
    </div>
  );
};

export default Medicines;
