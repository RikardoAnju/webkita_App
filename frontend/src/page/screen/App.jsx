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
import ForgotPassword from "../auth/forgotPassword";
import VerifyOTP from "../auth/VerifyOTP";

function App() {
  const path = window.location.pathname;

  // ── Halaman khusus tanpa layout (URL-based) ──────────────────────
  if (path === "/auth/verify-email") {
    return (
      <UserProvider>
        <VerifyEmail onGoToLogin={() => (window.location.href = "/")} />
      </UserProvider>
    );
  }

  const [currentPage, setCurrentPage] = useState("home");
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

  // Menyimpan data antar step forgot password
  const [forgotData, setForgotData] = useState({ otpToken: "", email: "" });

  const handleNavigateToDetail = (plan) => {
    setSelectedPlanDetails(plan);
    setCurrentPage("informasidetail");
  };

  // Step 1 selesai → simpan otpToken & email, pindah ke step 2
  const handleOTPSent = ({ otpToken, email }) => {
    setForgotData({ otpToken, email });
    setCurrentPage("otp-password");
  };

  const isAuthPage = [
    "login",
    "register",
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

      // Step 1 — input email, kirim OTP
      case "forgot-password":
        return (
          <ForgotPassword
            onBackToLogin={() => setCurrentPage("login")}
            onOTPSent={handleOTPSent}
          />
        );

      // Step 2 — verifikasi OTP + input password baru
      case "otp-password":
        return (
          <VerifyOTP
            otpToken={forgotData.otpToken}
            email={forgotData.email}
            onBackToForgot={() => setCurrentPage("forgot-password")}
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