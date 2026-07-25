import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { UserProvider, useUser } from "../../provider/user_provider.jsx";
import { ProjectProvider } from "../../provider/project_provider.jsx";
import Home from "../home/Home";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ProfilePage from "../profile/profile";
import CaraKerja from "../carakerja";
import InvoicePage from "../InvoicePage";
import Harga from "../harga";
import { PaymentProvider } from "../../provider/payment_provider.jsx";
import Orderan from "../orderan";
import InformasiDetail from "../informasiDetail";
import VerifyEmail from "../auth/VerifyEmail";
import ResetPassword from "../auth/resetpassword";
import ForgotPassword from "../auth/forgotpassword";
import VerifyOTP from "../auth/VerifyOTP";
import AdminDashboard from "../admin/AdminDashboard";

const ADMIN_ROLES = ["admin", "developer"];

const Spinner = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      border: "3px solid #E5E7EB", borderTop: "3px solid #3B82F6",
      animation: "spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
);

// Guard: hanya admin & developer
const AdminGuard = ({ children }) => {
  const { user, loading } = useUser();
  if (loading) return <Spinner />;
  if (!user || !ADMIN_ROLES.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

const GuestGuard = ({ children }) => {
  const { user, loading } = useUser();
  if (loading) return <Spinner />;
  if (user && ADMIN_ROLES.includes(user.role)) return <Navigate to="/admin" replace />;
  if (user) return <Navigate to="/" replace />;
  return children;
};


const AdminRedirect = ({ children }) => {
  const { user, loading } = useUser();
  if (loading) return <Spinner />;
  if (user && ADMIN_ROLES.includes(user.role)) return <Navigate to="/admin" replace />;
  return children;
};

function AppRoutes() {
  const navigate = useNavigate();

  const [selectedPlanDetails, setSelectedPlanDetails] = useState(() => {
    const saved = sessionStorage.getItem("selectedPlan");
    return saved ? JSON.parse(saved) : null;
  });
  const [forgotData, setForgotData] = useState({ otpToken: "", email: "" });
  const [verifiedData, setVerifiedData] = useState({ otpToken: "", otp: "", email: "" });

  const handleNavigateToDetail = (plan) => {
    setSelectedPlanDetails(plan);
    sessionStorage.setItem("selectedPlan", JSON.stringify(plan));
    navigate("/informasidetail");
  };

  const handleOTPSent = ({ otpToken, email }) => {
    setForgotData({ otpToken, email });
    navigate("/otp-password");
  };

  const handleOTPVerified = ({ otpToken, otp, email }) => {
    setVerifiedData({ otpToken, otp, email });
    navigate("/reset-password");
  };

  const handleBackToHome = () => {
    sessionStorage.removeItem("selectedPlan");
    setSelectedPlanDetails(null);
    navigate("/");
  };

  const handleBackToHarga = () => {
    sessionStorage.removeItem("selectedPlan");
    setSelectedPlanDetails(null);
    navigate("/harga");
  };

  return (
    <Routes>
      {/* ── Admin ── */}
      <Route path="/admin" element={
        <AdminGuard>
          <AdminDashboard />
        </AdminGuard>
      } />

      {/* ── Auth ── */}
      <Route path="/login" element={
        <GuestGuard>
          <Login
            onBackToHome={() => navigate("/")}
            onForgotPassword={() => navigate("/forgot-password")}
            onGoToRegister={() => navigate("/register")}
            onGoToAdmin={() => navigate("/admin")}
          />
        </GuestGuard>
      } />
      <Route path="/register" element={
        <GuestGuard>
          <Register onBackToHome={() => navigate("/")} />
        </GuestGuard>
      } />
      <Route path="/forgot-password" element={
        <ForgotPassword
          onBackToLogin={() => navigate("/login")}
          onOTPSent={handleOTPSent}
        />
      } />
      <Route path="/otp-password" element={
        <VerifyOTP
          otpToken={forgotData.otpToken}
          email={forgotData.email}
          onBackToForgot={() => navigate("/forgot-password")}
          onOTPVerified={handleOTPVerified}
        />
      } />
      <Route path="/reset-password" element={
        <ResetPassword
          otpToken={verifiedData.otpToken}
          otp={verifiedData.otp}
          email={verifiedData.email}
          onBackToVerify={() => navigate("/otp-password")}
          onSuccess={() => navigate("/login")}
        />
      } />

      {/* ── Public dengan Layout ── */}
      <Route path="*" element={
        <AdminRedirect>
          <Layout
            onLoginClick={() => navigate("/login")}
            onRegisterClick={() => navigate("/register")}
            onCaraKerjaClick={() => navigate("/carakerja")}
            onHargaClick={() => navigate("/harga")}
            onOrderanClick={() => navigate("/orderan")}
            onProfileClick={() => navigate("/profile")}
            onNavigateHome={() => navigate("/")}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/carakerja" element={<CaraKerja onBackToHome={() => navigate("/")} />} />
              <Route path="/harga" element={
                <Harga
                  onBackToHome={() => navigate("/")}
                  onSelectPlan={handleNavigateToDetail}
                />
              } />
              <Route path="/orderan" element={<Orderan onBackToHome={() => navigate("/")} />} />
              <Route path="/profile" element={<ProfilePage onBackToHome={() => navigate("/")} />} />
              <Route path="/invoice/:projectId" element={<InvoicePage />} />
              <Route path="/informasidetail" element={
                <InformasiDetail
                  plan={selectedPlanDetails}
                  onBackToHome={handleBackToHome}
                  onBackToHarga={handleBackToHarga}
                />
              } />
              <Route path="/auth/verify-email" element={
                <VerifyEmail onGoToLogin={() => navigate("/")} />
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </AdminRedirect>
      } />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <ProjectProvider>
        <PaymentProvider>
          <AppRoutes />
        </PaymentProvider>
      </ProjectProvider>
    </UserProvider>
  );
}

export default App;