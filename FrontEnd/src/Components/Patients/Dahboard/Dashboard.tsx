import React from "react";
import Welcome from "./Welcome";
import Appointments from "./Appointment";
import DiseasesChart from "./DiseasesChart";
import Visits from "./Visits";
import Medication from "./Medication";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <Welcome />
        <Visits />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <DiseasesChart />
        <Appointments />
        <Medication />
      </div>
    </div>
  );
};

export default Dashboard;
