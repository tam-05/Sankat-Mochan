import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import EventsPage from "./pages/EventsPage/EventsPage";

function App() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Dashboard Layout */}

      <Route
    path="/"
    element={
        <ProtectedRoute>
            <DashboardLayout />
        </ProtectedRoute>
    }
>

  <Route
    path="events"
    element={<EventsPage />}
/>
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="history" element={<HistoryPage />} />

        <Route path="settings" element={<SettingsPage />} />

      </Route>

      {/* Redirect */}

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;