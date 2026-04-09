import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../core/utils/api_client";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const extractErrorMessage = (err) => {
    return err.response?.data?.message || err.message || "Terjadi kesalahan pada server";
  };

  // --- AUTO LOGIN ---
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.get("/auth/profile", {  // ✅ fix: was /user/profile
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (err) {
          console.error("Session expired or invalid");
          logoutUser();
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  // --- 1. REGISTER ---
  const registerUser = async (formData) => {
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/register", formData);
      return { success: true, data: response.data };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LOGIN ---
  const loginUser = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/login-email", { email, password }); // ✅ fix: was /auth/login
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user_data);
        return { success: true };
      }
      throw new Error("Token tidak ditemukan dalam respons server");
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 3. VERIFY EMAIL (NEW) ---
  const verifyEmail = async (token, email) => {
    setLoading(true);
    setError("");
    try {
      const response = await API.get(`/auth/verify-email?token=${token}&email=${email}`);
      return { success: true, data: response.data };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 4. RESEND VERIFICATION (NEW) ---
  const resendVerification = async (email) => {
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/resend-verification", { email });
      return { success: true, data: response.data };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 5. UPDATE PROFILE ---
  const updateProfile = async (updateData) => {
    setLoading(true);
    setError("");
    try {
      const response = await API.put("/user/update", updateData);
      setUser(response.data);
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 6. FORGOT PASSWORD ---
  const forgotPassword = async (email) => {
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/forgot-password", { email });
      return { success: true, message: "Email pemulihan telah dikirim." };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 7. LOGOUT ---
  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError("");
  };

  const clearError = () => setError("");

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        registerUser,
        loginUser,
        logoutUser,
        updateProfile,
        forgotPassword,
        verifyEmail,         // ✅ new
        resendVerification,  // ✅ new
        setError,
        clearError,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser harus digunakan di dalam UserProvider");
  }
  return context;
};