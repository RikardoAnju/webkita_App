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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center border border-gray-100">

        {/* Loading */}
        {status === "loading" && (
          <>
            <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Memverifikasi email...</h2>
            <p className="text-gray-500 text-sm">Mohon tunggu sebentar.</p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verifikasi Berhasil!</h2>
            <p className="text-gray-500 text-sm mb-8">{message}</p>
            <button
              onClick={onGoToLogin}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Lanjut ke Login
            </button>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verifikasi Gagal</h2>
            <p className="text-gray-500 text-sm mb-8">{message}</p>

            {/* Resend button */}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 mb-3"
            >
              <RefreshCw className={`w-4 h-4 ${resendLoading ? "animate-spin" : ""}`} />
              {resendLoading ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
            </button>

            {resendMessage && (
              <p className="text-sm text-gray-500 mt-2">{resendMessage}</p>
            )}

            <button
              onClick={onGoToLogin}
              className="w-full mt-3 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Kembali ke Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default VerifyEmail;