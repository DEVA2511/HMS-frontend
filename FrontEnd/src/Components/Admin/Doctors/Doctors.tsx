import React, { useEffect, useState } from "react";
import { getAllDoctor } from "../../../Service/DoctorProfileService";
import DoctorCard from "./DoctorCard";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    getAllDoctor().then((res) => {
      setDoctors(res);
      console.table(res);
    });
  }, []);
  return (
    <div>
      <div className="text-xl text-primary-500 font-semibold mb-5">Doctors</div>
      <div className="grid grid-cols-5 gap-4">
        {doctors.map((doctor: any) => (
          <DoctorCard key={doctor.id} {...doctor} />
        ))}
      </div>
    </div>
  );
};

export default Doctors;
