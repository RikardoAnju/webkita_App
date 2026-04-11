import React, { useState } from "react";
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Lock } from "lucide-react";
import { useUser } from "../../provider/user_provider";

function ForgotPassword({ onBackToLogin, onOTPSent }) {
  const { forgotPassword } = useUser();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await forgotPassword(email.trim());

    setLoading(false);

    if (!result.success) {
      // Backend tidak bocorkan apakah email terdaftar atau tidak —
      // jika gagal berarti error server, bukan "email tidak ditemukan"
      setError(result.message || "Terjadi kesalahan. Silakan coba lagi.");
      return;
    }

    // Lanjut ke step 2, kirim otpToken + email ke parent
    onOTPSent({ otpToken: result.otpToken, email: email.trim() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <button
          onClick={onBackToLogin}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Login
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-gray-700" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Lupa Password</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Masukkan alamat email yang terdaftar. Kami akan mengirimkan kode OTP untuk
              mengatur ulang password Anda.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 transition disabled:bg-gray-100 disabled:cursor-not-allowed outline-none ${
                    isEmailValid
                      ? "border-green-400 focus:ring-green-500"
                      : email.length > 0
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {isEmailValid && (
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {email.length > 0 && !isEmailValid && (
                <p className="mt-1.5 text-xs text-red-600">Format email tidak valid.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isEmailValid}
              className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg active:scale-[0.98] disabled:bg-gray-400 disabled:scale-100 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Mengirim OTP...
                </span>
              ) : (
                "Kirim Kode OTP"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah ingat password?{" "}
              <button
                onClick={onBackToLogin}
                className="font-semibold text-gray-900 hover:underline transition"
              >
                Masuk sekarang
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;