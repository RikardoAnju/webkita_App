import React, { useState } from "react";
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
  const path = window.location.pathname;

  if (path === "/auth/verify-email") {
    return (
      <UserProvider>
        <VerifyEmail onGoToLogin={() => (window.location.href = "/")} />
      </UserProvider>
    );
  }

  const [currentPage, setCurrentPage] = useState("home");
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

  const [forgotData, setForgotData] = useState({ otpToken: "", email: "" });
  const [verifiedData, setVerifiedData] = useState({ otpToken: "", otp: "", email: "" });

  const handleNavigateToDetail = (plan) => {
    setSelectedPlanDetails(plan);
    setCurrentPage("informasidetail");
  };

  const handleOTPSent = ({ otpToken, email }) => {
    setForgotData({ otpToken, email });
    setCurrentPage("otp-password");
  };

  const handleOTPVerified = ({ otpToken, otp, email }) => {
    setVerifiedData({ otpToken, otp, email });
    setCurrentPage("reset-password");
  };

  const isAuthPage = [
    "login",
    "register",
    "reset-password",
    "forgot-password",
    "otp-password",
  ].includes(currentPage);

  const renderContent = () => {
    switch (currentPage) {
      case "login":
        return (
          <Login
            onBackToHome={() => setCurrentPage("home")}
            onForgotPassword={() => setCurrentPage("forgot-password")}
            onGoToRegister={() => setCurrentPage("register")}
          />
        );

      case "forgot-password":
        return (
          <ForgotPassword
            onBackToLogin={() => setCurrentPage("login")}
            onOTPSent={handleOTPSent}
          />
        );

      case "otp-password":
        return (
          <VerifyOTP
            otpToken={forgotData.otpToken}
            email={forgotData.email}
            onBackToForgot={() => setCurrentPage("forgot-password")}
            onOTPVerified={handleOTPVerified}
          />
        );

      case "reset-password":
        return (
          <ResetPassword
            otpToken={verifiedData.otpToken}
            otp={verifiedData.otp}
            email={verifiedData.email}
            onBackToVerify={() => setCurrentPage("otp-password")}
            onSuccess={() => setCurrentPage("login")}
          />
        );

      case "register":
        return (
          <Register onBackToHome={() => setCurrentPage("home")} />
        );

      case "carakerja":
        return <CaraKerja onBackToHome={() => setCurrentPage("home")} />;

      case "harga":
        return (
          <Harga
            onBackToHome={() => setCurrentPage("home")}
            onSelectPlan={handleNavigateToDetail}
          />
        );

      case "orderan":
        return <Orderan onBackToHome={() => setCurrentPage("home")} />;

      case "profile":
        return <ProfilePage onBackToHome={() => setCurrentPage("home")} />;

      case "informasidetail":
        return (
          <InformasiDetail
            plan={selectedPlanDetails}
            onBackToHome={() => setCurrentPage("home")}
            onBackToHarga={() => setCurrentPage("harga")}
          />
        );

      default:
        return <Home />;
    }
  };

  return (
    <UserProvider>
      {isAuthPage ? (
        renderContent()
      ) : (
        <Layout
          onLoginClick={() => setCurrentPage("login")}
          onRegisterClick={() => setCurrentPage("register")}
          onCaraKerjaClick={() => setCurrentPage("carakerja")}
          onHargaClick={() => setCurrentPage("harga")}
          onOrderanClick={() => setCurrentPage("orderan")}
          onProfileClick={() => setCurrentPage("profile")}
          onNavigateHome={() => setCurrentPage("home")}
          currentPage={currentPage}
        >
          {renderContent()}
        </Layout>
      )}
    </UserProvider>
  );
}

export default App;