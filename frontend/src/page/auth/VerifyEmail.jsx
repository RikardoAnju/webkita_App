import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader, RefreshCw } from "lucide-react";
import { useUser } from "../../provider/user_provider";

function VerifyEmail({ onGoToLogin }) {
  const { verifyEmail, resendVerification } = useUser();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const emailParam = params.get("email");
    if (!token || !emailParam) {
      setStatus("error");
      setMessage("Link verifikasi tidak valid atau sudah kadaluarsa.");
      return;
    }
    setEmail(emailParam);
    verifyEmail(token, emailParam).then((result) => {
      if (result.success) {
        setStatus("success");
        setMessage("Email kamu berhasil diverifikasi!");
      } else {
        setStatus("error");
        setMessage(result.message || "Verifikasi gagal. Link mungkin sudah kadaluarsa.");
      }
    });
  }, []);

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setResendMessage("");
    const result = await resendVerification(email);
    setResendMessage(
      result.success
        ? "Email verifikasi baru telah dikirim. Cek inbox kamu."
        : result.message
    );
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Webkita</span>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Platform Teknologi #1</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Accent bar */}
          <div
            className="h-1 w-full"
            style={{ background: "linear-gradient(90deg,#111827 0%,#2563EB 60%,#93c5fd 100%)" }}
          />

          <div className="p-10 text-center">

            {/* Loading */}
            {status === "loading" && (
              <>
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Memproses
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Memverifikasi email...</h2>
                <p className="text-gray-400 text-sm">Mohon tunggu sebentar.</p>
              </>
            )}

            {/* Success */}
            {status === "success" && (
              <>
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Selesai
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Verifikasi Berhasil!</h2>
                <p className="text-gray-400 text-sm mb-8">{message}</p>

                {/* Stats strip */}
                <div className="grid grid-cols-3 bg-gray-50 rounded-xl border border-gray-100 mb-8 text-left overflow-hidden">
                  <div className="px-4 py-3 border-r border-gray-100">
                    <p className="text-xs text-gray-400">Pengguna Aktif</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">100k+</p>
                  </div>
                  <div className="px-4 py-3 border-r border-gray-100">
                    <p className="text-xs text-gray-400">Respon Cepat</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">&lt; 24 Jam</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs text-gray-400">Garansi</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">Keamanan</p>
                  </div>
                </div>

                <button
                  onClick={onGoToLogin}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-sm"
                >
                  Mulai Sekarang →
                </button>
              </>
            )}

            {/* Error */}
            {status === "error" && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Gagal
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Verifikasi Gagal</h2>
                <p className="text-gray-400 text-sm mb-8">{message}</p>

                {/* Info box */}
                <div className="text-left bg-blue-50 border-l-2 border-blue-600 rounded-r-lg px-4 py-3 mb-6">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Link verifikasi berlaku <strong>24 jam</strong> sejak email dikirim.
                    Kamu bisa kirim ulang email baru di bawah.
                  </p>
                </div>

                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 text-sm mb-3"
                >
                  <RefreshCw className={`w-4 h-4 ${resendLoading ? "animate-spin" : ""}`} />
                  {resendLoading ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
                </button>

                {resendMessage && (
                  <p className="text-xs text-gray-500 mb-3">{resendMessage}</p>
                )}

                <button
                  onClick={onGoToLogin}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-sm"
                >
                  Kembali ke Login
                </button>
              </>
            )}

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-6">
          © 2026 Webkita · Hubungkan Bisnis Anda dengan Developer Terbaik
        </p>

      </div>
    </div>
  );
}

export default VerifyEmail;