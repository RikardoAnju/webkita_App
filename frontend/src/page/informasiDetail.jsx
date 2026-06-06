import React, { useState, useEffect, useCallback } from "react";
import { Check, Upload, X, Plus, ChevronDown, AlertCircle } from "lucide-react";
import API from "../core/utils/api_client";
import { ENDPOINTS } from "../core/constants/api_endpoint";

const extractErrorMessage = (err) => {
  if (typeof err === "string") return err;
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error?.message ||
    err?.message ||
    "Terjadi kesalahan pada server"
  );
};

const useCreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = useCallback(() => setError(""), []);

  const createProject = async (submission, attachments = []) => {
    setLoading(true);
    setError("");
    try {
      const form = new FormData();

      if (submission.planTitle) form.append("planTitle", submission.planTitle);
      if (submission.projectTitle) form.append("projectTitle", submission.projectTitle);
      if (submission.category) form.append("category", submission.category);
      if (submission.description) form.append("description", submission.description);
      if (submission.skills) form.append("skills", submission.skills);
      if (submission.contactName) form.append("contactName", submission.contactName);
      if (submission.contactPhone) form.append("contactPhone", submission.contactPhone);
      if (submission.additionalNotes) form.append("additionalNotes", submission.additionalNotes);

      for (const file of attachments) {
        form.append("attachments", file);
      }

      const data = await API.post(ENDPOINTS.CREATE_PROJECT, form);

      return { success: true, data: data.data };
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error, clearError };
};

const InformasiDetail = ({ plan, onBackToHome, onBackToHarga }) => {
  const { createProject, loading, error, clearError } = useCreateProject();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectTitle: "",
    category: "",
    description: "",
    skills: [],
    attachments: [],
    contactName: "",
    contactPhone: "",
    additionalNotes: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    "E-commerce",
    "Landing Page",
    "Company Profile",
    "Mobile Application",
    "Dashboard",
    "Web Application",
    "Blog/CMS",
    "Portfolio",
    "Lainnya",
  ];

  const steps = [
    { number: 1, title: "Informasi Dasar", icon: "📋" },
    { number: 2, title: "Skill & Lampiran", icon: "🔧" },
    { number: 3, title: "Kontak", icon: "📞" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => onBackToHome(), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, onBackToHome]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skillToRemove) });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter((f) => f.size <= maxSize);
    if (validFiles.length !== files.length) {
      alert("Beberapa file melebihi ukuran maksimal 10MB dan tidak ditambahkan");
    }
    setFormData({ ...formData, attachments: [...formData.attachments, ...validFiles] });
  };

  const handleRemoveFile = (fileToRemove) => {
    setFormData({ ...formData, attachments: formData.attachments.filter((f) => f !== fileToRemove) });
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.projectTitle.trim() &&
          formData.category.trim() &&
          formData.description.length >= 100
        );
      case 2:
        return formData.skills.length > 0;
      case 3:
        return formData.contactName.trim() && formData.contactPhone.trim();
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    clearError();

    const submission = {
      planTitle: plan?.title ?? "",
      projectTitle: formData.projectTitle,
      category: formData.category,
      description: formData.description,
      skills: formData.skills.join(", "),
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      additionalNotes: formData.additionalNotes,
    };

    const result = await createProject(submission, formData.attachments);
    if (result.success) setSubmitSuccess(true);
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proyek Berhasil Diajukan!</h2>
          <p className="text-gray-600 mb-6">
            Tim kami akan menghubungi Anda segera melalui WhatsApp untuk detail lebih lanjut.
          </p>
          <div className="animate-pulse text-sm text-gray-500">Mengalihkan ke halaman utama...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBackToHarga}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-6 transition group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Halaman Harga
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Informasi Detail Proyek</h1>
          <p className="text-gray-600">Lengkapi informasi proyek Anda untuk mendapatkan penawaran terbaik</p>
          {plan && (
            <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold">
              Paket Terpilih: {plan.title} ({plan.priceRange})
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">Gagal Mengirim Pengajuan</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${currentStep >= step.number ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-400"}`}>
                    {currentStep > step.number ? <Check className="w-6 h-6" /> : step.icon}
                  </div>
                  <span className={`text-xs font-semibold mt-2 text-center ${currentStep >= step.number ? "text-blue-600" : "text-gray-400"}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-all ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Informasi Dasar</h2>
                <p className="text-gray-600 mb-6">Berikan informasi dasar tentang proyek Anda</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Proyek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Website E-commerce untuk Fashion"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition text-left flex items-center justify-between bg-white"
                  >
                    <span className={formData.category ? "text-gray-900" : "text-gray-400"}>
                      {formData.category || "Pilih kategori proyek"}
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                  {categoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => { handleInputChange("category", cat); setCategoryDropdownOpen(false); }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Proyek <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Jelaskan secara detail kebutuhan proyek Anda, fitur yang diinginkan, target audience, dan ekspektasi hasil..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimal 100 karakter. ({formData.description.length}/100)
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Skill & Lampiran</h2>
                <p className="text-gray-600 mb-6">Tambahkan skill atau teknologi yang dibutuhkan untuk proyek ini</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skill yang Dibutuhkan <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">Tambahkan skill atau teknologi yang dibutuhkan untuk proyek ini</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: React, Node.js, MongoDB"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Tambah
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2">
                        <span className="font-medium">{skill}</span>
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:bg-blue-200 rounded-full p-1 transition">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lampiran</label>
                <p className="text-xs text-gray-500 mb-3">Upload dokumen pendukung seperti wireframe, mockup, atau requirement document</p>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 font-medium">Klik untuk upload file</span>
                  <span className="text-xs text-gray-400 mt-1">PDF, PNG, JPG (Max 10MB)</span>
                  <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
                </label>
                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                        <span className="text-sm text-gray-700 truncate flex-1">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        <button type="button" onClick={() => handleRemoveFile(file)} className="text-red-500 hover:text-red-700 ml-4">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Informasi Kontak</h2>
                <p className="text-gray-600 mb-6">Kami akan menghubungi Anda melalui informasi ini</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Tambahan</label>
                <textarea
                  placeholder="Ada hal lain yang ingin Anda sampaikan?"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                />
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  ✅ <strong>Hampir selesai!</strong> Pastikan semua informasi sudah benar sebelum mengirim.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={currentStep === 1 ? onBackToHarga : handlePrevStep}
              disabled={loading}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 1 ? "Kembali" : "Sebelumnya"}
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isStepValid()}
                className={`px-6 py-3 rounded-lg font-semibold transition ${isStepValid() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Selanjutnya
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid() || loading}
                className={`px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${isStepValid() && !loading ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Pengajuan"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformasiDetail;