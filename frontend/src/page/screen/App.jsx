// src/page/screen/App.jsx
import React, { useState } from "react";
import Layout from "../../components/Layout";
import { UserProvider } from "../../provider/UserProvider";

// Import Halaman
import Home from "../home/Home"; // File baru
import Login from "../auth/login";
import Register from "../auth/register";
import ProfilePage from "../profile/profile";
import CaraKerja from "../carakerja";
import Harga from "../harga";
import Orderan from "../orderan";
import InformasiDetail from "../informasiDetail";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

  // Fungsi navigasi detail
  const handleNavigateToDetail = (plan) => {
    setSelectedPlanDetails(plan);
    setCurrentPage("informasidetail");
  };

  // Logika Switch Content (Tetap di sini atau dipisah ke komponen Helper)
  const renderContent = () => {
    switch (currentPage) {
      case "login": return <Login onBackToHome={() => setCurrentPage("home")} />;
      case "register": return <Register onBackToHome={() => setCurrentPage("home")} />;
      case "carakerja": return <CaraKerja onBackToHome={() => setCurrentPage("home")} />;
      case "harga": return <Harga onBackToHome={() => setCurrentPage("home")} onSelectPlan={handleNavigateToDetail} />;
      case "orderan": return <Orderan onBackToHome={() => setCurrentPage("home")} />;
      case "profile": return <ProfilePage onBackToHome={() => setCurrentPage("home")} />;
      case "informasidetail": 
        return <InformasiDetail plan={selectedPlanDetails} onBackToHome={() => setCurrentPage("home")} onBackToHarga={() => setCurrentPage("harga")} />;
      default: return <Home />;
    }
  };

  return (
    <UserProvider>
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
    </UserProvider>
  );
}

export default App;