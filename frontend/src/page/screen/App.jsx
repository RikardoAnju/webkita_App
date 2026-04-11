import React, { useState } from "react";
import Layout from "../../components/Layout";
import { UserProvider } from "../../provider/user_provider";
import Home from "../home/Home";
import Login from "../auth/login";
import Register from "../auth/register";
import ProfilePage from "../profile/profile";
import CaraKerja from "../carakerja";
import Harga from "../harga";
import Orderan from "../orderan";
import InformasiDetail from "../informasiDetail";
import VerifyEmail from "../auth/VerifyEmail";
import ForgotPassword from "../auth/ForgotPassword";

function App() {
  const path = window.location.pathname;

  // ✅ halaman khusus tanpa layout
  if (path === "/auth/verify-email") {
    return (
      <UserProvider>
        <VerifyEmail onGoToLogin={() => (window.location.href = "/")} />
      </UserProvider>
    );
  }

  const [currentPage, setCurrentPage] = useState("home");
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

  const handleNavigateToDetail = (plan) => {
    setSelectedPlanDetails(plan);
    setCurrentPage("informasidetail");
  };

  // ✅ DETEKSI halaman auth
  const isAuthPage = ["login", "register", "forgot-password"].includes(currentPage);

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
            onBackToHome={() => setCurrentPage("home")}
            onBackToLogin={() => setCurrentPage("login")}
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