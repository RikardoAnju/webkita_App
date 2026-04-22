import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { UserProvider } from "../../provider/user_provider";
import Home from "../home/Home";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ProfilePage from "../profile/profile";
import CaraKerja from "../carakerja";
import Harga from "../harga";
import Orderan from "../orderan";
import InformasiDetail from "../informasiDetail";
import VerifyEmail from "../auth/VerifyEmail";
import ResetPassword from "../auth/resetpassword";
import ForgotPassword from "../auth/forgotpassword";
import VerifyOTP from "../auth/VerifyOTP";

function App() {
  const navigate = useNavigate();
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [forgotData, setForgotData] = useState({ otpToken: "", email: "" });
  const [verifiedData, setVerifiedData] = useState({ otpToken: "", otp: "", email: "" });

  const handleNavigateToDetail = (plan) => {
    setSelectedPlanDetails(plan);
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

  const authRoutes = ["/login", "/register", "/reset-password", "/forgot-password", "/otp-password"];
  const isAuthPage = authRoutes.includes(window.location.pathname);

  return (
    <UserProvider>
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={
            <Login
              onBackToHome={() => navigate("/")}
              onForgotPassword={() => navigate("/forgot-password")}
              onGoToRegister={() => navigate("/register")}
            />
          } />
          <Route path="/register" element={
            <Register onBackToHome={() => navigate("/")} />
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
        </Routes>
      ) : (
        <Layout
          onLoginClick={() => navigate("/login")}
          onRegisterClick={() => navigate("/register")}
          onCaraKerjaClick={() => navigate("/carakerja")}
          onHargaClick={() => navigate("/harga")}
          onOrderanClick={() => navigate("/orderan")}
          onProfileClick={() => navigate("/profile")}
          onNavigateHome={() => navigate("/")}
          currentPage={window.location.pathname.replace("/", "") || "home"}
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
            <Route path="/informasidetail" element={
              <InformasiDetail
                plan={selectedPlanDetails}
                onBackToHome={() => navigate("/")}
                onBackToHarga={() => navigate("/harga")}
              />
            } />
            <Route path="/auth/verify-email" element={
              <VerifyEmail onGoToLogin={() => navigate("/")} />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      )}
    </UserProvider>
  );
}

export default App;