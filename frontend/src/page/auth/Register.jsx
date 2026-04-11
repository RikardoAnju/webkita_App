import React, { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useUser } from "../../provider/user_provider";

// Komponen Password Input dengan Memo agar tidak re-render yang tidak perlu
const PasswordInputWithValidation = React.memo(({ id, label, value, onChange, disabled, show, toggleShow, isValid }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Lock className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={id}
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full pl-10 ${isValid ? "pr-20" : "pr-12"} py-3 border rounded-lg focus:ring-2 transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
          isValid ? "border-green-400 focus:ring-green-500" : value.length > 0 ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
        placeholder={id === "password" ? "Minimal 8 karakter" : "Ulangi password"}
      />
      <div className="absolute inset-y-0 right-0 flex items-center">
        {isValid && (
          <div className="pr-2 flex items-center pointer-events-none">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        )}
        <button type="button" onClick={toggleShow} disabled={disabled} className="pr-3 flex items-center hover:opacity-70 transition">
          {show ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
        </button>
      </div>
    </div>
  </div>
));

function Register({ onBackToHome }) {
  // Ambil fungsi & state dari UserProvider
  const { registerUser, loading, error, setError } = useUser();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(0);
  
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "pembeli",
    groupID: 2,
    subscribeNewsletter: false,
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Filter khusus nomor telepon: hanya angka
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    
    if (error) setError(""); 
  };

  // Validasi Client-side (Helper Boolean)
  const isUsernameValid = formData.username.trim().length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPhoneValid = formData.phone.length >= 10 && formData.phone.length <= 15;
  const isPasswordValid = formData.password.length >= 8;
  const isConfirmPasswordValid = formData.password.length >= 8 && formData.password === formData.confirmPassword;

  const validateForm = () => {
    if (!isUsernameValid) { setError("Username minimal 3 karakter."); return false; }
    if (!isEmailValid) { setError("Format email tidak valid."); return false; }
    if (!isPhoneValid) { setError("Nomor WhatsApp harus 10-15 digit."); return false; }
    if (!isPasswordValid) { setError("Password minimal 8 karakter."); return false; }
    if (!isConfirmPasswordValid) { setError("Konfirmasi password tidak cocok."); return false; }
    if (!formData.terms) { setError("Anda harus menyetujui Syarat & Ketentuan."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Mapping ke snake_case untuk Backend
    const registerData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role,
      group_id: formData.groupID,
      is_aktif: "Y",
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      phone: formData.phone.trim(),
      subscribe_newsletter: formData.subscribeNewsletter,
    };

    const result = await registerUser(registerData);

    if (result.success) {
      setSuccess(true);
      setSuccessCountdown(3);

      const interval = setInterval(() => {
        setSuccessCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onBackToHome(); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      {/* Modal Sukses */}
      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-scale-in">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Registrasi Berhasil!</h3>
            <p className="text-gray-600 mb-6">Akun Anda telah dibuat. Mengalihkan dalam {successCountdown}...</p>
            <button onClick={onBackToHome} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Lanjut ke Login
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl w-full space-y-8">
        <button onClick={onBackToHome} className="inline-flex items-center text-gray-600 hover:text-gray-900 transition font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 bordeacr border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun</h2>
            <p className="text-gray-600">Silakan lengkapi formulir di bawah ini</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start animate-slide-down">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Contoh: budisudono"
                  className={`block w-full pl-10 py-3 border rounded-lg focus:ring-2 transition ${
                    isUsernameValid ? "border-green-400 focus:ring-green-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>

            {/* Nama Lengkap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Depan</label>
                <input name="firstName" placeholder="Nama Depan" value={formData.firstName} onChange={handleChange} disabled={loading} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Belakang</label>
                <input name="lastName" placeholder="Nama Belakang" value={formData.lastName} onChange={handleChange} disabled={loading} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Email & Nomor WA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="nama@email.com"
                    className={`block w-full pl-10 py-3 border rounded-lg focus:ring-2 transition ${
                      isEmailValid ? "border-green-400 focus:ring-green-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="08123456789"
                    className={`block w-full pl-10 py-3 border rounded-lg focus:ring-2 transition ${
                      isPhoneValid ? "border-green-400 focus:ring-green-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <PasswordInputWithValidation id="password" label="Password" value={formData.password} onChange={handleChange} disabled={loading} show={showPassword} toggleShow={() => setShowPassword(!showPassword)} isValid={isPasswordValid} />
            
            {/* Konfirmasi Password */}
            <PasswordInputWithValidation id="confirmPassword" label="Konfirmasi Password" value={formData.confirmPassword} onChange={handleChange} disabled={loading} show={showConfirmPassword} toggleShow={() => setShowConfirmPassword(!showConfirmPassword)} isValid={isConfirmPasswordValid} />

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
              <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} disabled={loading} className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                Saya menyetujui <span className="text-blue-600 cursor-pointer hover:underline">Syarat & Ketentuan</span> serta <span className="text-blue-600 cursor-pointer hover:underline">Kebijakan Privasi</span> yang berlaku.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg active:scale-[0.98] disabled:bg-gray-400 disabled:scale-100 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Memproses...
                </span>
              ) : "Daftar Sekarang"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;