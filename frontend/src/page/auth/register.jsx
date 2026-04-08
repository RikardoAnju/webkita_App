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
import { useUser } from "../../provider/UserProvider"; 

// Komponen Password Input tetap sama
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
  // 👈 Ambil fungsi & state dari Provider
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(""); // Bersihkan error di provider saat user mengetik
  };

  // Validasi Client-side
  const isUsernameValid = formData.username.trim().length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPasswordValid = formData.password.length >= 8;
  const isConfirmPasswordValid = formData.password.length >= 8 && formData.password === formData.confirmPassword;

  const validateForm = () => {
    if (!isUsernameValid) { setError("Username minimal 3 karakter."); return false; }
    if (!isEmailValid) { setError("Format email tidak valid."); return false; }
    if (!isPasswordValid) { setError("Password minimal 8 karakter."); return false; }
    if (!isConfirmPasswordValid) { setError("Konfirmasi password tidak cocok."); return false; }
    if (!formData.terms) { setError("Anda harus menyetujui Syarat & Ketentuan."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Mapping data ke format yang diminta backend Go (snake_case)
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

    // 👈 Panggil fungsi dari Provider
    const result = await registerUser(registerData);

    if (result.success) {
      setSuccess(true);
      setSuccessCountdown(3);

      // Countdown & Redirect
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
      {/* Modal Sukses (Tetap Sama) */}
      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-scale-in">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Registrasi Berhasil!</h3>
            <p className="text-gray-600 mb-6">Akun Anda telah dibuat. Mengalihkan dalam {successCountdown}...</p>
            <button onClick={onBackToHome} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
              Lanjut ke Login
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl w-full space-y-8">
        <button onClick={onBackToHome} className="inline-flex items-center text-gray-600 hover:text-gray-900 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Pembeli</h2>
            <p className="text-gray-600">Lengkapi data diri Anda</p>
          </div>

          {/* Tampilkan error dari Provider atau Local */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start animate-slide-down">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username *</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="min 3 karakter"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 transition ${
                    isUsernameValid ? "border-green-400 focus:ring-green-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>

            {/* Nama Depan & Belakang */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" placeholder="Nama Depan" value={formData.firstName} onChange={handleChange} disabled={loading} className="p-3 border rounded-lg" />
              <input name="lastName" placeholder="Nama Belakang" value={formData.lastName} onChange={handleChange} disabled={loading} className="p-3 border rounded-lg" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
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

            <PasswordInputWithValidation id="password" label="Password" value={formData.password} onChange={handleChange} disabled={loading} show={showPassword} toggleShow={() => setShowPassword(!showPassword)} isValid={isPasswordValid} />
            <PasswordInputWithValidation id="confirmPassword" label="Konfirmasi Password" value={formData.confirmPassword} onChange={handleChange} disabled={loading} show={showConfirmPassword} toggleShow={() => setShowConfirmPassword(!showConfirmPassword)} isValid={isConfirmPasswordValid} />

            <div className="flex items-start gap-2">
              <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} disabled={loading} className="mt-1 h-4 w-4" />
              <label htmlFor="terms" className="text-sm text-gray-700">Setujui Syarat & Ketentuan *</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 flex items-center justify-center"
            >
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;