import React from "react";
import Navbar from "./navbar";
import Footer from "./Footer";

/**
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {function} props.onLoginClick
 * @param {function} props.onCaraKerjaClick
 * @param {function} props.onNavigateHome
 * @param {function} props.onHargaClick
 * @param {function} props.onRegisterClick
 * @param {function} props.onOrderanClick
 * @param {string} props.currentPage
 */
export default function Layout({
  children,
  onLoginClick,
  onCaraKerjaClick,
  onNavigateHome,
  onRegisterClick,
  onHargaClick,
  onOrderanClick,
  currentPage,
}) {
  const hideNavAndFooter = ["login", "register"];
  const shouldHide = hideNavAndFooter.includes(currentPage);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!shouldHide && (
        <Navbar
          onLoginClick={onLoginClick}
          onCaraKerjaClick={onCaraKerjaClick}
          onNavigateHome={onNavigateHome}
          onHargaClick={onHargaClick}
          onOrderanClick={onOrderanClick}
          onRegisterClick={onRegisterClick}
        />
      )}
      <main className="flex-grow">{children}</main>
      {!shouldHide && <Footer />}
    </div>
  );
}
