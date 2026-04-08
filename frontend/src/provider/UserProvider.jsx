import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../core/utils/api_endpoint"; // Sesuaikan path ke file axios kamu

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Fungsi Registrasi (Menggantikan fetch manual di Register.jsx)
  const registerUser = async (formData) => {
    setLoading(true);
    setError("");
    try {
      // Endpoint sesuai backend Go kamu: /auth/register
      const response = await API.post("/auth/register", formData);
      return { success: true, data: response };
    } catch (err) {
      // err di sini sudah berupa string pesan error dari interceptor axios kita
      setError(err);
      return { success: false, message: err };
    } finally {
      setLoading(false);
    }
  };

  // 2. Fungsi Login
  const loginUser = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/login", { email, password });
      // Simpan token ke localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
        setUser(response.user_data);
      }
      return { success: true };
    } catch (err) {
      setError(err);
      return { success: false, message: err };
    } finally {
      setLoading(false);
    }
  };

  // 3. Fungsi Logout
  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        registerUser,
        loginUser,
        logoutUser,
        setError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook kustom untuk memudahkan penggunaan
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser harus digunakan di dalam UserProvider");
  }
  return context;
};