import React, { useState } from "react";
import { ArrowLeft, AlertCircle, CheckCircle, Lock, Eye, EyeOff } from "lucide-react";
import { useUser } from "../../provider/user_provider";

function ResetPassword({ otpToken, otp, email, onBackToVerify, onSuccess }) {
  const { resetPassword } = useUser();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isPasswordValid = newPassword.length >= 8;
  const isPasswordMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = isPasswordValid && isPasswordMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError("");

    const result = await resetPassword({
      otp_token: otpToken,
      otp: otp,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message || "Gagal mereset password. Silakan coba lagi.");
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Berhasil Diubah</h2>
            <p className="text-gray-500 text-sm mb-8">
              Password akun <span className="font-semibold text-gray-700">{email}</span> telah
              berhasil diperbarui. Silakan login dengan password baru Anda.
            </p>
            <button
              onClick={onSuccess}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-md active:scale-[0.98]"
            >
              Ke Halaman Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <button
          onClick={onBackToVerify}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-gray-700" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-500 text-sm">
              Buat password baru untuk akun{" "}
              <span className="font-semibold text-gray-700">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); if (error) setError(""); }}
                  disabled={loading}
                  placeholder="Minimal 8 karakter"
                  className={`block w-full px-4 pr-10 py-3 border rounded-lg focus:ring-2 transition disabled:bg-gray-100 outline-none ${
                    newPassword.length === 0
                      ? "border-gray-300 focus:ring-blue-500"
                      : isPasswordValid
                      ? "border-green-400 focus:ring-green-500"
                      : "border-red-400 focus:ring-red-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {newPassword.length > 0 && !isPasswordValid && (
                <p className="mt-1.5 text-xs text-red-600">Password minimal 8 karakter.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (error) setError(""); }}
                  disabled={loading}
                  placeholder="Ulangi password baru"
                  className={`block w-full px-4 pr-10 py-3 border rounded-lg focus:ring-2 transition disabled:bg-gray-100 outline-none ${
                    confirmPassword.length === 0
                      ? "border-gray-300 focus:ring-blue-500"
                      : isPasswordMatch
                      ? "border-green-400 focus:ring-green-500"
                      : "border-red-400 focus:ring-red-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !isPasswordMatch && (
                <p className="mt-1.5 text-xs text-red-600">Password tidak cocok.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !canSubmit}
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
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;