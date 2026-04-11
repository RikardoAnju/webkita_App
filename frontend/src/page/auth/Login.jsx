import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";
import React, { useState } from "react";
import { useUser } from "../../provider/user_provider";

function Login({ onBackToHome, onForgotPassword, onGoToRegister }) {
  const { loginUser } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }
    if (!email.includes("@")) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    const result = await loginUser(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Login gagal. Periksa email dan password.");
      return;
    }

    setSuccess("Login berhasil!");
    setTimeout(() => onBackToHome(), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Back */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Masuk ke Akun
          </h2>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  disabled={loading}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none transition disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  disabled={loading}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none transition disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-gray-600 hover:text-gray-900 hover:underline transition"
              >
                Lupa password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg active:scale-[0.98] disabled:bg-gray-400 disabled:scale-100 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{" "}
              <button
                onClick={onGoToRegister}
                className="font-semibold text-gray-900 hover:underline transition"
              >
                Daftar sekarang
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;