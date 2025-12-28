import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// layout
import Layout from "./components/Layout";

// dashboards
import DashboardContent from "./components/DashboardContent";
import WorkerDashBoard from "./components/WorkerDashBoard";

// auth routes
import UserLogin from "./routes/Login_New";
import AdminLogin from "./routes/AdminLogin";
import WorkerLogin from "./routes/WorkerLogin";

// app routes
import Events from "./routes/Events";
import Complaints from "./routes/Complaints";
import Ordering from "./routes/Ordering";
import Emergency from "./routes/Emergency";
import Services from "./routes/Services";
import RentMaintenance from "./routes/RentMaintenance";
import Me from "./routes/Me";
import Discover from "./routes/discover";
import SecurityCams from "./routes/Security-cams";
import VisitorAndDelivery from "./routes/VisitorAndDelivery";


const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user") ||
      localStorage.getItem("admin") ||
      localStorage.getItem("worker");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* ================= AUTH ROUTES ================= */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/worker" element={<WorkerLogin />} />
      <Route path="/discover" element={<Discover />} />

      {/* ================= PROTECTED ROUTES ================= */}
      <Route element={<Layout user={user} />}>
        {/* dashboards */}
        <Route path="/dashboard" element={<DashboardContent />} />
        <Route path="/dashboard/worker" element={<WorkerDashBoard />} />

        {/* features */}
        <Route path="/events" element={<Events />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/ordering" element={<Ordering />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/services" element={<Services />} />
        <Route path="/rent-maintenance" element={<RentMaintenance />} />
        <Route path="/security-cams" element={<SecurityCams />} />
        <Route path="/visitor-delivery" element={<VisitorAndDelivery />} />
        <Route path="/me" element={<Me />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
};

export default App;
