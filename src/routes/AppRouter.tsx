import { Navigate, Route, Routes } from "react-router-dom";
import { PublicRoute } from "@/routes/PublicRoute";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { routePaths } from "@/routes/routePaths";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminProvidersPage } from "@/pages/admin/AdminProvidersPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ClientHomePage } from "@/pages/client/ClientHomePage";
import { DashboardPage } from "@/pages/client/DashboardPage";
import { FavoritesPage } from "@/pages/client/FavoritesPage";
import { MyBookingsPage } from "@/pages/client/MyBookingsPage";
import { ProviderHomePage } from "@/pages/provider/ProviderHomePage";
import { AvailabilityPage } from "@/pages/provider/AvailabilityPage";
import { CreateServicePage } from "@/pages/provider/CreateServicePage";
import { EditServicePage } from "@/pages/provider/EditServicePage";
import { ProviderBookingsPage } from "@/pages/provider/ProviderBookingsPage";
import { MyServicesPage } from "@/pages/provider/MyServicesPage";
import { ProviderSetupPage } from "@/pages/provider/ProviderSetupPage";
import { ProviderVerificationPage } from "@/pages/provider/ProviderVerificationPage";
import { HomePage } from "@/pages/public/HomePage";
import { ServicesPage } from "@/pages/public/ServicesPage";
import { ServiceDetailsPage } from "@/pages/public/ServiceDetailsPage";
import { ProfilePage } from "@/pages/common/ProfilePage";

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
          <PublicRoute>
            <ClientHomePage />
          </PublicRoute>
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
        path={routePaths.favorites}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["client"]}>
              <FavoritesPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.providerHome}
        element={
          <PublicRoute>
            <ProviderHomePage />
          </PublicRoute>
        }
      />
      <Route
        path={routePaths.providerAvailability}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <AvailabilityPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.providerSetup}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <ProviderSetupPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.providerServiceCreate}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <CreateServicePage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.providerServiceEdit}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <EditServicePage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.providerServices}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <MyServicesPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.providerBookings}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <ProviderBookingsPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.providerVerification}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <ProviderVerificationPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.adminHome}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin", "platform_admin"]}>
              <Navigate replace to={routePaths.adminDashboard} />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.adminDashboard}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin", "platform_admin"]}>
              <AdminDashboardPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.adminProviders}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin", "platform_admin"]}>
              <AdminProvidersPage />
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
        path={routePaths.profile}
        element={
          <ProtectedRoute>
            <ProfilePage />
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
