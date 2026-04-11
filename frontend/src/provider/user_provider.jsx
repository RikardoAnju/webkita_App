import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../core/utils/api_client";
import { ENDPOINTS } from "../core/constants/api_endpoint";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mapResponseToUser = (r) => ({
  id: r.id,
  username: r.username,
  firstName: r.first_name,
  lastName: r.last_name,
  email: r.email,
  phone: r.phone,
  groupId: r.group_id,
  role: r.role ?? "user",
  isAktif: r.is_aktif,
  isEmailVerified: r.is_email_verified,
  subscribeNewsletter: r.subscribe_newsletter,
  createdAt: r.createdAt,
});

const extractErrorMessage = (err) => {
  if (typeof err === "string") return err;
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error?.message ||
    err?.message ||
    "Terjadi kesalahan pada server"
  );
};

// ─── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const clearError = useCallback(() => setError(""), []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setError("");
  }, []);

  // --- AUTO LOGIN (session restore) ---
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await API.get(ENDPOINTS.GET_PROFILE);
          setUser(mapResponseToUser(data));
        } catch {
          console.warn("Session expired or invalid — logging out");
          logoutUser();
        }
      }
      setLoading(false);
    };
    checkSession();
  }, [logoutUser]);

  // --- 1. REGISTER ---
  const registerUser = async (data) => {
    setLoading(true);
    setError("");
    try {
      await API.post(ENDPOINTS.REGISTER, data);
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LOGIN (email) ---
  const loginUser = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await API.post(ENDPOINTS.LOGIN_EMAIL, { email, password });
      const { token, user: userData } = data;

      if (!token) throw new Error("Token tidak ditemukan dalam respons server");

      localStorage.setItem("token", token);
      setUser(mapResponseToUser(userData));
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 3. LOGIN (username) ---
  const loginWithUsername = async (username, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await API.post(ENDPOINTS.LOGIN_USERNAME, { username, password });
      const { token, user: userData } = data;

      if (!token) throw new Error("Token tidak ditemukan dalam respons server");

      localStorage.setItem("token", token);
      setUser(mapResponseToUser(userData));
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 4. VERIFY EMAIL ---
  const verifyEmail = async (token, email) => {
    setLoading(true);
    setError("");
    try {
      await API.get(`${ENDPOINTS.VERIFY_EMAIL}?token=${token}&email=${email}`);
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 5. RESEND VERIFICATION ---
  const resendVerification = async (email) => {
    setLoading(true);
    setError("");
    try {
      await API.post(ENDPOINTS.RESEND_VERIFICATION, { email });
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 6. UPDATE PROFILE ---
  const updateProfile = async (formData) => {
    setLoading(true);
    setError("");
    try {
      const data = await API.put(ENDPOINTS.UPDATE_USER, formData);
      setUser(mapResponseToUser(data));
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 7. FORGOT PASSWORD ---
  const forgotPassword = async (email) => {
    setLoading(true);
    setError("");
    try {
      const data = await API.post(ENDPOINTS.FORGOT_PASSWORD, { email });

      // Jika otp_token kosong, email tidak terdaftar
      if (!data.otp_token) {
        return { success: false, message: "Email tidak terdaftar." };
      }

      return { success: true, otpToken: data.otp_token };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 8. RESET PASSWORD ---
  const resetPassword = async (payload) => {
    setLoading(true);
    setError("");
    try {
      await API.post(ENDPOINTS.RESET_PASSWORD, payload);
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        registerUser,
        loginUser,
        loginWithUsername,
        logoutUser,
        updateProfile,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        setError,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser harus digunakan di dalam UserProvider");
  }
  return context;
};