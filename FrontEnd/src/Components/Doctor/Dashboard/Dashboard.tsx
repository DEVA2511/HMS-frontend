import Metrices from "./Metrices";
import DiseasesChart from "./DiseasesChart";
import PatientMetrices from "./PatientMetrices";
import Patients from "./Patients";
import Appointment from "./Appointment";
import Welcome from "./Welcome";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <Welcome />
        <Metrices />
      </div>
      <div>
        <div className="grid grid-cols-3 gap-5">
          <DiseasesChart />
          <div className="col-span-2">
            <PatientMetrices />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Patients />
        </div>
        <div>
          <Appointment />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
