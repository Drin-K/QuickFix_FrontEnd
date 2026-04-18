import { Navigate, Route, Routes } from "react-router-dom";
import { AdminHomePage } from "@/pages/AdminHomePage";
import { ClientHomePage } from "@/pages/ClientHomePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { ProviderHomePage } from "@/pages/ProviderHomePage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ServiceDetailsPage } from "@/pages/ServiceDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/client-home" element={<ClientHomePage />} />
      <Route path="/provider-home" element={<ProviderHomePage />} />
      <Route path="/admin-home" element={<AdminHomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/services/:id" element={<ServiceDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
