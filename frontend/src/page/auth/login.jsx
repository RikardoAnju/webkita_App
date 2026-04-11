import { ArrowLeft, Eye, EyeOff, Mail, Lock, Loader } from "lucide-react";
import React, { useState } from "react";

function Login({ onBackToHome, onForgotPassword, onGoToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    if (!email.includes("@")) {
      setError("Format email tidak valid");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/v1/auth/login-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      const token = data.data?.accessToken || data.accessToken || data.token;

      if (!token) {
        throw new Error("Token tidak diterima");
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("accessToken", token);

      setSuccess("Login berhasil!");

      setTimeout(() => {
        window.location.href = "/app";
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Back */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-center mb-6">
            Masuk ke Akun
          </h2>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-3 border rounded"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 p-3 border rounded"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded"
          >
            {loading ? "Loading..." : "Masuk"}
          </button>

          {/* Forgot */}
          <div className="text-right mt-2">
            <button onClick={onForgotPassword} className="text-blue-600">
              Lupa password?
            </button>
          </div>

          {/* Register */}
          <div className="text-center mt-4">
            <button onClick={onGoToRegister} className="text-blue-600">
              Daftar sekarang
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;