import { ArrowLeft, Eye, EyeOff, Mail, Lock, Loader } from "lucide-react";
import React, { useState } from "react";

function Login() {
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

    // Validasi input
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Respons dari server tidak valid");
      }

      if (!response.ok) {
        throw new Error(data.message || `Login gagal: ${response.status}`);
      }

      // 🔥 DEBUG: Tampilkan struktur response lengkap
      console.log("📦 Full Response:", JSON.stringify(data, null, 2));

      // 🔥 Ekstraksi data dengan berbagai kemungkinan struktur
      const token = data.data?.accessToken || data.accessToken || data.token;
      const refreshToken = data.data?.refreshToken || data.refreshToken;
      
      // 🔥 Coba berbagai kemungkinan lokasi userId
      const userId = 
        data.data?.userId || 
        data.data?.user_id || 
        data.data?.id ||
        data.userId || 
        data.user_id || 
        data.id ||
        data.data?.user?.id ||
        data.user?.id;

      console.log("🔑 Token:", token);
      console.log("👤 User ID:", userId);
      console.log("🔄 Refresh Token:", refreshToken);

      if (!token) {
        throw new Error("Token tidak diterima dari server");
      }

  
      if (!userId) {
        console.warn("⚠️ WARNING: userId tidak ditemukan dalam response!");
        console.warn("📋 Struktur data yang diterima:", data);
      }

      setSuccess("Login berhasil! Mengalihkan...");

      // Simpan token - gunakan localStorage jika rememberMe dicentang
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("accessToken", token);
      if (refreshToken) storage.setItem("refreshToken", refreshToken);
      
      // 🔥 Simpan userId dengan validasi
      if (userId) {
        storage.setItem("userId", String(userId)); // Pastikan dalam bentuk string
        console.log("✅ userId berhasil disimpan:", userId);
      } else {
        console.error("❌ userId TIDAK disimpan karena tidak ditemukan!");
      }
      
      storage.setItem("userEmail", email.trim());

      console.log("✅ Login berhasil, data disimpan di", rememberMe ? "localStorage" : "sessionStorage");

      // Redirect ke halaman App setelah 1 detik
      setTimeout(() => {
        window.location.href = "/app";
      }, 1000);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat login");
      console.error("❌ Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <div>
          <a
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </a>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Masuk ke Akun
            </h2>
            <p className="text-gray-600 text-sm">
              Masukkan kredensial Anda untuk melanjutkan
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                  disabled={loading}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Lupa password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sedang masuk...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold transition"
              >
                Daftar sekarang
              </a>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Dengan masuk, Anda menyetujui{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Syarat & Ketentuan
            </a>{" "}
            dan{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Kebijakan Privasi
            </a>{" "}
            kami
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;