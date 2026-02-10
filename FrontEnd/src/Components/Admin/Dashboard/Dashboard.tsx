import React from "react";
import TopCards from "./TopCards";
import DiseasesChart from "./DiseasesChart";
import Appointment from "./Appointment";
import Medicines from "./Medicines";
import Patients from "./Patients";
import Doctors from "./Doctors";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <TopCards />
      <div className="grid grid-cols-3 gap-5">
        <DiseasesChart />
        <Appointment />
        <Medicines />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Patients />
        <Doctors />
      </div>
    </div>
  );
};

export default Dashboard;
