import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../core/utils/api_client";
import { ENDPOINTS } from "../core/utils/api_endpoint";

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
          const response = await API.get(ENDPOINTS.GET_PROFILE, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(mapResponseToUser(response.data));
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
      const response = await API.post(ENDPOINTS.LOGIN_EMAIL, { email, password });
      const { token, user: userData } = response.data;

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
      const response = await API.post(ENDPOINTS.LOGIN_USERNAME, { username, password });
      const { token, user: userData } = response.data;

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
      await API.get(ENDPOINTS.VERIFY_EMAIL, { params: { token, email } });
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
  const updateProfile = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await API.put(ENDPOINTS.UPDATE_USER, data);
      setUser(mapResponseToUser(response.data));
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 7. FORGOT PASSWORD (step 1) ---
  // Backend returns { otp_token: "<jwt>" }
  // Simpan otpToken di komponen pemanggil, lalu kirim ke resetPassword()
  const forgotPassword = async (email) => {
    setLoading(true);
    setError("");
    try {
      const response = await API.post(ENDPOINTS.FORGOT_PASSWORD, { email });
      return { success: true, otpToken: response.data.otp_token };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 8. RESET PASSWORD (step 2) ---
  // data: { otp_token, otp, new_password, confirm_password }
  const resetPassword = async (data) => {
    setLoading(true);
    setError("");
    try {
      await API.post(ENDPOINTS.RESET_PASSWORD, data);
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 9. LOGOUT ---
  // logoutUser sudah didefinisikan di atas via useCallback

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

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser harus digunakan di dalam UserProvider");
  }
  return context;
};