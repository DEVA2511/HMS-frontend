import { useEffect, useState } from "react";
import { getAllPatients } from "../../../Service/PatientProfileService";
import PatinetCard from "./PatinetCard";

const Patient = () => {
  const [patients, setPatient] = useState([]);
  useEffect(() => {
    getAllPatients().then((res) => {
      setPatient(res);
    });
  }, []);
  return (
    <div>
      <div className="text-xl text-primary-500 font-semibold mb-5">
        Patients
      </div>
      <div className="grid grid-cols-5 gap-4">
        {patients.map((patient: any) => (
          <PatinetCard key={patient.id} {...patient} />
        ))}
      </div>
    </div>
  );
};

export default Patient;
