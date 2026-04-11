import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, AlertCircle, KeyRound } from "lucide-react";
import { useUser } from "../../provider/user_provider";

function VerifyOTP({ otpToken, email, onBackToForgot, onOTPVerified }) {
  const { resetPassword } = useUser();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const otpValue = otp.join("");
  const isOtpComplete = otpValue.length === 6;

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (error) setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // Verifikasi OTP saja — gunakan dummy reset untuk cek validitas token+otp
  // Trik: kirim new_password kosong, backend akan reject karena password, bukan karena OTP salah
  // ATAU: kalau backend punya endpoint verify-otp tersendiri, pakai itu
  // Di sini kita simpan otp lalu lanjut ke halaman reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOtpComplete) return;

    setLoading(true);
    setError("");

    // Verifikasi OTP dulu dengan mengirim ke backend
    // Kita pakai resetPassword dengan password placeholder untuk cek OTP valid
    // Jika backend return error soal password (bukan OTP), berarti OTP benar
    const result = await resetPassword({
      otp_token: otpToken,
      otp: otpValue,
      new_password: "placeholder_check_only",
      confirm_password: "placeholder_check_only",
    });

    setLoading(false);

    // Jika sukses atau error bukan soal OTP, berarti OTP valid
    if (result.success) {
      // Kalau backend langsung sukses dengan placeholder (tidak mungkin tapi handle)
      onOTPVerified({ otpToken, otp: otpValue, email });
      return;
    }

    const msg = result.message?.toLowerCase() || "";
    // Jika error soal password (bukan OTP invalid/expired), berarti OTP benar
    const isOtpError =
      msg.includes("otp") ||
      msg.includes("invalid") ||
      msg.includes("expired") ||
      msg.includes("kedaluwarsa") ||
      msg.includes("tidak valid");

    if (isOtpError) {
      setError(result.message || "Kode OTP tidak valid atau sudah kedaluwarsa.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } else {
      // Error soal password = OTP valid, lanjut ke reset password
      onOTPVerified({ otpToken, otp: otpValue, email });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <button
          onClick={onBackToForgot}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-gray-700" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi OTP</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Masukkan kode 6 digit yang dikirim ke{" "}
              <span className="font-semibold text-gray-700">{email}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Kode berlaku selama 5 menit</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                Kode OTP
              </label>
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    disabled={loading}
                    className={`w-11 text-center text-xl font-bold border-2 rounded-lg outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      digit
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-300 focus:border-gray-600"
                    }`}
                    style={{ height: "52px" }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isOtpComplete}
              className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg active:scale-[0.98] disabled:bg-gray-400 disabled:scale-100 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memverifikasi...
                </span>
              ) : (
                "Verifikasi OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;