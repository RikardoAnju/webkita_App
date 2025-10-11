import React, { useState, useEffect } from "react";
import { Check, ArrowRight, X } from "lucide-react";

// Modal untuk menampilkan detail paket
const PricingModal = ({ plan, isOpen, onClose, onSelectPlan }) => {
  if (!isOpen || !plan) return null;

  const getColorScheme = () => {
    switch (plan.tier) {
      case "starter":
        return {
          badge: "bg-blue-600",
          bgLight: "bg-blue-50",
          button: "bg-blue-600 hover:bg-blue-700",
          checkBg: "bg-green-100",
          checkColor: "text-green-600",
        };
      case "professional":
        return {
          badge: "bg-purple-600",
          bgLight: "bg-purple-50",
          button: "bg-purple-600 hover:bg-purple-700",
          checkBg: "bg-green-100",
          checkColor: "text-green-600",
        };
      case "business":
        return {
          badge: "bg-green-600",
          bgLight: "bg-green-50",
          button: "bg-green-600 hover:bg-green-700",
          checkBg: "bg-green-100",
          checkColor: "text-green-600",
        };
      case "enterprise":
        return {
          badge: "bg-orange-600",
          bgLight: "bg-orange-50",
          button: "bg-orange-600 hover:bg-orange-700",
          checkBg: "bg-green-100",
          checkColor: "text-green-600",
        };
      default:
        return {
          badge: "bg-blue-600",
          bgLight: "bg-blue-50",
          button: "bg-blue-600 hover:bg-blue-700",
          checkBg: "bg-green-100",
          checkColor: "text-green-600",
        };
    }
  };

  const colors = getColorScheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start rounded-t-2xl">
          <div className="flex-1">
            {plan.badge && (
              <div
                className={`inline-block ${colors.badge} text-white px-3 py-1 rounded-lg text-xs font-bold mb-3`}
              >
                {plan.badge}
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{plan.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{plan.priceRange}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 -m-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className={`${colors.bgLight} rounded-xl p-6 mb-6`}>
            <button
              onClick={() => onSelectPlan(plan)}
              className={`w-full ${colors.button} text-white py-3 px-6 rounded-lg font-semibold transition shadow-md`}
            >
              Pilih Paket Ini
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`w-5 h-5 ${colors.checkBg} rounded-full flex items-center justify-center`}
                >
                  <Check className={`w-3 h-3 ${colors.checkColor}`} />
                </div>
                <h3 className="font-bold text-gray-900">Yang Anda Dapatkan:</h3>
              </div>
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check
                      className={`w-4 h-4 ${colors.checkColor} flex-shrink-0 mt-0.5`}
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {plan.notIncluded && plan.notIncluded.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">ℹ️</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Tidak Termasuk:</h3>
                </div>
                <div className="space-y-2">
                  {plan.notIncluded.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">●</span>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                {plan.upgradeNote && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 flex items-start gap-2">
                      <span>💡</span>
                      <span>{plan.upgradeNote}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal untuk notifikasi login
const LoginPromptModal = ({ isOpen, onClose, onLoginClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Login Diperlukan
        </h2>
        <p className="text-gray-600 mb-8">
          Anda harus login terlebih dahulu untuk memilih paket layanan kami.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={onLoginClick}
            className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen utama halaman Harga
const Harga = ({ onBackToHome, onSelectPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [budget, setBudget] = useState(13000000);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
    console.log(
      "🔐 Status Login:",
      !!accessToken ? "Logged In" : "Not Logged In"
    );
    console.log("📥 Props diterima:", {
      onBackToHome: typeof onBackToHome,
      onSelectPlan: typeof onSelectPlan,
    });
  }, []);

  const pricingPlans = [
    {
      title: "Starter",
      description: "Landing Page Sederhana",
      minPrice: 3000000,
      maxPrice: 7000000,
      price: "3.000.000",
      priceRange: "Rp 3.000.000 - Rp 7.000.000",
      tier: "starter",
      timeline: "1-2 minggu",
      features: [
        "Landing Page Sederhana (3-5 halaman)",
        "Design Responsif Mobile & Desktop",
        "Form Kontak",
        "Google Maps Integration",
        "SEO Basic",
        "+3 fitur lainnya",
      ],
      notIncluded: [],
    },
    {
      title: "Professional",
      description: "Website Multi-Halaman",
      minPrice: 7000000,
      maxPrice: 15000000,
      price: "7.000.000",
      priceRange: "Rp 7.000.000 - Rp 15.000.000",
      tier: "professional",
      timeline: "2-3 bulan",
      badge: "Rekomendasi Anda",
      isRecommended: true,
      features: [
        "Website Multi-Halaman (8-15 halaman)",
        "Design Custom & Modern",
        "Admin Dashboard Sederhana",
        "Database Integration",
        "CMS untuk Update Content",
        "Email Integration",
        "SEO Optimization",
        "+7 fitur lainnya",
      ],
      notIncluded: [
        "Payment Gateway Integration",
        "Advanced E-commerce Features",
        "Mobile App",
      ],
      upgradeNote: "Upgrade ke paket Business untuk mendapatkan fitur ini",
    },
    {
      title: "Business",
      description: "Website E-commerce Lengkap",
      minPrice: 15000000,
      maxPrice: 30000000,
      price: "15.000.000",
      priceRange: "Rp 15.000.000 - Rp 30.000.000",
      tier: "business",
      timeline: "3-6 bulan",
      features: [
        "Website E-commerce Lengkap",
        "Admin Dashboard Advanced",
        "User Management System",
        "Payment Gateway Integration",
        "Inventory Management",
        "+9 fitur lainnya",
      ],
      notIncluded: [],
    },
    {
      title: "Enterprise",
      description: "Platform Custom Sesuai Kebutuhan",
      minPrice: 30000000,
      maxPrice: 100000000,
      price: "30.000.000",
      priceRange: "Rp 30.000.000 - Rp 100.000.000",
      tier: "enterprise",
      timeline: "6+ bulan",
      badge: "ENTERPRISE",
      features: [
        "Platform Custom Sesuai Kebutuhan",
        "Multi-vendor E-commerce",
        "Advanced Admin Dashboard",
        "API Integration (Payment, Shipping, dll)",
        "Mobile App (iOS & Android)",
        "+12 fitur lainnya",
      ],
      notIncluded: [],
    },
  ];

  const getRecommendedPlan = () => {
    return (
      pricingPlans.find(
        (plan) => budget >= plan.minPrice && budget <= plan.maxPrice
      ) || pricingPlans[pricingPlans.length - 1]
    );
  };

  const recommendedPlan = getRecommendedPlan();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  const handleCardClick = (plan) => {
    if (!isLoggedIn) {
      console.log("⚠️ User belum login, menampilkan modal login");
      setIsLoginPromptOpen(true);
      return;
    }
    console.log("📋 Membuka detail paket:", plan.title);
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("❌ Menutup modal");
    setIsModalOpen(false);
    setTimeout(() => setSelectedPlan(null), 300);
  };

  const handleLoginClick = () => {
    setIsLoginPromptOpen(false);
    alert("Silakan login terlebih dahulu dari menu navigasi");
  };

  const handleSelectPlan = (plan) => {
    console.log("✅ Paket dipilih:", plan.title);
    
    // Debug: Cek semua item di storage
    console.log("🔍 Debug Storage:");
    console.log("  - sessionStorage.userId:", sessionStorage.getItem("userId"));
    console.log("  - localStorage.userId:", localStorage.getItem("userId"));
    console.log("  - sessionStorage.accessToken:", sessionStorage.getItem("accessToken"));
    console.log("  - localStorage.accessToken:", localStorage.getItem("accessToken"));
    
    // Coba ambil dari berbagai kemungkinan key
    const userId = 
      sessionStorage.getItem("userId") || 
      localStorage.getItem("userId") ||
      sessionStorage.getItem("user_id") ||
      localStorage.getItem("user_id");
    
    console.log("🔍 User ID ditemukan:", userId);
    console.log("🔍 Tipe data userId:", typeof userId);
    
    if (!userId || userId === "null" || userId === "undefined") {
      console.error("❌ User ID tidak ditemukan!");
      console.error("💡 Tip: Pastikan saat login, userId disimpan dengan:");
      console.error("   sessionStorage.setItem('userId', response.data.userId);");
      alert("User ID tidak ditemukan. Silakan login kembali.\n\nJika masalah berlanjut, hubungi administrator.");
      return;
    }
    
    // Tambahkan userId ke dalam data plan
    const planWithUserId = {
      ...plan,
      userId: parseInt(userId), // Pastikan userId dalam format number
    };
    
    console.log("📦 Data paket yang dikirim:", {
      title: planWithUserId.title,
      tier: planWithUserId.tier,
      minPrice: planWithUserId.minPrice,
      maxPrice: planWithUserId.maxPrice,
      priceRange: planWithUserId.priceRange,
      timeline: planWithUserId.timeline,
      features: planWithUserId.features,
      userId: planWithUserId.userId,
    });

    // Tutup modal terlebih dahulu
    setIsModalOpen(false);
    setSelectedPlan(null);

    // Cek apakah onSelectPlan tersedia
    console.log("🔍 Checking onSelectPlan:", typeof onSelectPlan);

    if (typeof onSelectPlan === "function") {
      console.log("✅ Mengirim data ke InformasiDetail...");
      try {
        onSelectPlan(planWithUserId);
        console.log("✅ Data berhasil dikirim!");
      } catch (error) {
        console.error("❌ Error saat mengirim data:", error);
        alert("Terjadi kesalahan saat memproses paket. Silakan coba lagi.");
      }
    } else {
      console.error("❌ onSelectPlan function tidak tersedia!");
      alert("Terjadi kesalahan sistem. Function onSelectPlan tidak ditemukan.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
      <main className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Paket Layanan Kami
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Dari UMKM
              hingga enterprise, kami siap membantu mewujudkan website impian
              Anda.
            </p>
          </div>

          {/* Budget Slider Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 max-w-4xl mx-auto">
            <div className="flex items-start mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-blue-600 text-xl">💎</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Berapa Budget Anda?
                </h2>
                <p className="text-gray-600 text-sm">
                  Geser slider untuk melihat rekomendasi paket dan fitur
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Budget Anda
              </label>
              <div className="text-right mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  Rp {formatCurrency(budget)}
                </span>
              </div>
              <input
                type="range"
                min="3000000"
                max="100000000"
                step="1000000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                    ((budget - 3000000) / (100000000 - 3000000)) * 100
                  }%, #e5e7eb ${
                    ((budget - 3000000) / (100000000 - 3000000)) * 100
                  }%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Rp 3 Juta</span>
                <span>Rp 100 Juta</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-bold text-gray-900">
                      Paket Rekomendasi: {recommendedPlan.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {recommendedPlan.priceRange}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Yang Anda Dapatkan:
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {recommendedPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {recommendedPlan.notIncluded &&
                  recommendedPlan.notIncluded.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">ℹ️</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          Tidak Termasuk:
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {recommendedPlan.notIncluded.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5">●</span>
                            <span className="text-sm text-gray-600">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                      {recommendedPlan.upgradeNote && (
                        <p className="text-sm text-blue-600 mt-3 flex items-start gap-1">
                          <span>💡</span>
                          <span>{recommendedPlan.upgradeNote}</span>
                        </p>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                  plan.tier === recommendedPlan.tier
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200"
                }`}
                onClick={() => handleCardClick(plan)}
              >
                {plan.tier === recommendedPlan.tier && (
                  <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                    Rekomendasi Anda
                  </div>
                )}

                <div
                  className="w-full h-1 rounded-full mb-4"
                  style={{
                    background:
                      plan.tier === "starter"
                        ? "#3b82f6"
                        : plan.tier === "professional"
                        ? "#8b5cf6"
                        : plan.tier === "business"
                        ? "#10b981"
                        : "#f97316",
                  }}
                ></div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {plan.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{plan.priceRange}</p>

                <div className="space-y-2 mb-4">
                  {plan.features.slice(0, 5).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-2 px-4 rounded-lg font-semibold text-sm border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 mb-16">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>💡</span>
              Tips Menentukan Budget
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Pertimbangkan Kebutuhan
                </h4>
                <p className="text-sm text-gray-600">
                  Apakah Anda butuh website sederhana atau platform kompleks
                  dengan banyak fitur?
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Timeline Proyek
                </h4>
                <p className="text-sm text-gray-600">
                  Proyek mendesak biasanya membutuhkan budget lebih tinggi
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Maintenance & Support
                </h4>
                <p className="text-sm text-gray-600">
                  Alokasikan budget untuk pemeliharaan website setelah launching
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Skalabilitas</h4>
                <p className="text-sm text-gray-600">
                  Pikirkan pertumbuhan bisnis untuk 1-2 tahun ke depan
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-10 sm:p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Butuh Konsultasi Paket?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Tim kami siap membantu Anda menemukan solusi terbaik untuk
              kebutuhan bisnis Anda. Hubungi kami untuk konsultasi gratis!
            </p>
            <a
              href="https://wa.me/6282171484751?text=Halo%20saya%20ingin%20konsultasi%20tentang%20paket%20layanan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg transform hover:scale-105"
            >
              Hubungi Kami di WhatsApp
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>

          {onBackToHome && (
            <div className="text-center mt-16">
              <button
                onClick={onBackToHome}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition shadow-lg"
              >
                Kembali ke Beranda
              </button>
            </div>
          )}
        </div>
      </main>

      <PricingModal
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectPlan={handleSelectPlan}
      />

      <LoginPromptModal
        isOpen={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
        onLoginClick={handleLoginClick}
      />
    </div>
  );
};

export default Harga;