import React, { useState, useEffect } from "react";
import { Menu, X, LogOut, Settings, User } from "lucide-react";

export default function Navbar({
  onLoginClick,
  onRegisterClick,
  onCaraKerjaClick,
  onNavigateHome,
  onHargaClick,
  onOrderanClick,
  onProfileClick,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const email = sessionStorage.getItem("userEmail");

    if (accessToken) {
      setIsLoggedIn(true);
      setUserEmail(email || "User");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userEmail");

    setIsLoggedIn(false);
    setProfileMenuOpen(false);
    window.location.href = "/";
  };

  const handleProfile = () => {
    setProfileMenuOpen(false);
    if (onProfileClick) {
      onProfileClick();
    } else {
      window.location.href = "/profile";
    }
  };

  const navLinks = [
    {
      name: "Beranda",
      onClick: onNavigateHome || (() => (window.location.href = "/")),
    },
    { name: "Cara Kerja", onClick: onCaraKerjaClick || (() => {}) },
    { name: "Harga", onClick: onHargaClick || (() => {}) },
  ];

  const loggedInNavLinks = [
    {
      name: "Beranda",
      onClick: onNavigateHome || (() => (window.location.href = "/")),
    },
    
    { name: "Cara Kerja", onClick: onCaraKerjaClick || (() => {}) },
    { name: "Orderan", onClick: onOrderanClick || (() => {}) },
    { name: "Harga", onClick: onHargaClick || (() => {}) },
  ];

  const currentNavLinks = isLoggedIn ? loggedInNavLinks : navLinks;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div
            className="text-2xl font-bold text-gray-900 cursor-pointer"
            onClick={onNavigateHome || (() => (window.location.href = "/"))}
          >
            Webkita
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {currentNavLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.onClick}
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                {link.name}
              </button>
            ))}

            {/* Jika belum login */}
            {!isLoggedIn ? (
              <>
                <button
                  onClick={
                    onLoginClick || (() => (window.location.href = "/login"))
                  }
                  className="text-gray-700 hover:text-blue-600 transition font-medium px-6 py-2"
                >
                  Masuk
                </button>
                <button
                  onClick={
                    onRegisterClick ||
                    (() => (window.location.href = "/register"))
                  }
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Daftar
                </button>
              </>
            ) : (
            
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {userEmail}
                      </p>
                    </div>
                    <button
                      onClick={handleProfile}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Profil
                    </button>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        window.location.href = "/settings";
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Pengaturan
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition flex items-center gap-2 border-t border-gray-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3 border-t pt-4">
            {currentNavLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  link.onClick();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700 hover:text-blue-600 transition font-medium py-2"
              >
                {link.name}
              </button>
            ))}

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    if (onLoginClick) {
                      onLoginClick();
                    } else {
                      window.location.href = "/login";
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-gray-700 hover:text-blue-600 transition font-medium py-2 text-left"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    if (onRegisterClick) {
                      onRegisterClick();
                    } else {
                      window.location.href = "/register";
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Daftar
                </button>
              </>
            ) : (
              <>
                <div className="py-3 border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-900 px-2 mb-3">
                    {userEmail}
                  </p>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleProfile();
                    }}
                    className="w-full text-left text-gray-700 hover:text-blue-600 transition font-medium py-2 px-2 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profil
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = "/settings";
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-700 hover:text-blue-600 transition font-medium py-2 px-2 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:text-red-700 transition font-medium py-2 px-2 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}