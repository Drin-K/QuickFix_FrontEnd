import { Navigate, Route, Routes } from "react-router-dom";
import { PublicRoute } from "@/routes/PublicRoute";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { routePaths } from "@/routes/routePaths";
import { AdminHomePage } from "@/pages/admin/AdminHomePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ClientHomePage } from "@/pages/client/ClientHomePage";
import { DashboardPage } from "@/pages/client/DashboardPage";
import { MyBookingsPage } from "@/pages/client/MyBookingsPage";
import { ProviderHomePage } from "@/pages/provider/ProviderHomePage";
import { HomePage } from "@/pages/public/HomePage";
import { ServicesPage } from "@/pages/public/ServicesPage";
import { ServiceDetailsPage } from "@/pages/public/ServiceDetailsPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path={routePaths.home}
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />
      <Route
        path={routePaths.login}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path={routePaths.register}
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path={routePaths.clientHome}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["client"]}>
              <ClientHomePage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.myBookings}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["client"]}>
              <MyBookingsPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.providerHome}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <ProviderHomePage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.adminHome}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin", "platform_admin"]}>
              <AdminHomePage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.dashboard}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.services}
        element={
          <PublicRoute>
            <ServicesPage />
          </PublicRoute>
        }
      />
      <Route
        path={routePaths.serviceDetails}
        element={
          <PublicRoute>
            <ServiceDetailsPage />
          </PublicRoute>
        }
      />
      <Route path="*" element={<Navigate replace to={routePaths.home} />} />
    </Routes>
  );
};
