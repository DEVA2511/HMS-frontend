import { BrowserRouter, Route, Routes } from "react-router-dom";
import Random from "../Components/Random";
import AdminDashBoard from "../Layout/AdminDashBoard";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import PublicRouter from "./PublicRouter";
import ProtectedRouter from "./ProductedRoutes";
import PatientDashBoard from "../Layout/PatientDashBoard";
import PatientProfilePage from "../Pages/Patient/PatientProfilePage";
import DoctorDashBoard from "../Layout/DoctorDashBoard";
import DoctorProfilePage from "../Pages/Doctor/DoctorProfilePage";
import PatientAppointmentsPage from "../Pages/Patient/PatientAppointmentsPage";
import DoctorAppointmentsPage from "../Pages/Doctor/DoctorAppointmentsPage";
import DoctorAppontmentDetailsPage from "../Pages/Doctor/DoctorAppontmentDetailsPage";
import AdminMedicnePage from "../Pages/Admin/AdminMedicnePage";
import NotFound from "../Pages/NotFoundPage";
import { AdminInventoryPage } from "../Pages/Admin/AdminInventoryPage";
import SalesPage from "../Pages/Admin/SalesPage";
import AdminPatientPage from "../Pages/Admin/AdminPatientPage";
import { AdminDoctorPage } from "../Pages/Admin/AdminDoctorPage";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import DoctorDashboard from "../Pages/Doctor/DoctorDashboard";
import PatientDashboard from "../Pages/Patient/PatientDashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRouter>
              <LoginPage />
            </PublicRouter>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRouter>
              <RegisterPage />
            </PublicRouter>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRouter>
              <AdminDashBoard />
            </ProtectedRouter>
          }
        ></Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRouter>
              <AdminDashBoard />
            </ProtectedRouter>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="medicine" element={<AdminMedicnePage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="patients" element={<AdminPatientPage />} />
          <Route path="doctors" element={<AdminDoctorPage />} />
        </Route>

        {/* Patient Routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRouter>
              <PatientDashBoard />
            </ProtectedRouter>
          }
        >
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="profile" element={<PatientProfilePage />} />
          <Route path="appointment" element={<PatientAppointmentsPage />} />
        </Route>
        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRouter>
              <DoctorDashBoard />
            </ProtectedRouter>
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="profile" element={<DoctorProfilePage />} />

          <Route path="appointments" element={<DoctorAppointmentsPage />} />
          <Route
            path="appointments/:id"
            element={<DoctorAppontmentDetailsPage />}
          />

          <Route path="pharmacy" element={<Random />} />
          <Route path="patients" element={<Random />} />
          <Route path="doctors" element={<Random />} />
        </Route>
        {/* add the 404 page error message */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
