import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Users,
  Lock,
  Bell,
} from "lucide-react";
import { useUser } from "../../provider/user_provider";

const ProfileDashboard = () => {
  const { user, loading, error, updateProfile, setError } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const startEditing = () => {
    setEditForm({
      username: user?.username || "",
      first_name: user?.firstName || "",
      last_name: user?.lastName || "",
      phone: user?.phone || "",
      subscribe_newsletter: user?.subscribeNewsletter || false,
    });
    setIsEditing(true);
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    const result = await updateProfile(editForm);
    setSaving(false);

    if (result.success) {
      setIsEditing(false);
      setEditForm(null);
      setSuccessMessage("Profil berhasil diperbarui!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      user: { label: "Pembeli", color: "bg-blue-100 text-blue-800 border-blue-300" },
      developer: { label: "Developer", color: "bg-purple-100 text-purple-800 border-purple-300" },
      admin: { label: "Admin", color: "bg-red-100 text-red-800 border-red-300" },
    };
    return roleConfig[role] || roleConfig.user;
  };

  const getStatusBadge = (isAktif) =>
    isAktif === "Y"
      ? { label: "Aktif", color: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle }
      : { label: "Tidak Aktif", color: "bg-gray-100 text-gray-800 border-gray-300", icon: X };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gagal Memuat Profil</h2>
          <p className="text-gray-600 mb-6">
            {error || "Anda belum login. Silakan login terlebih dahulu."}
          </p>
        </div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(user.role);
  const statusBadge = getStatusBadge(user.isAktif);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Profil Pengguna</h1>
            <p className="text-gray-600">Kelola informasi akun Anda</p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32" />

          <div className="relative px-6 pb-6">
            <div className="flex items-end -mt-16 mb-4">
              <div className="w-32 h-32 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center">
                <User className="w-16 h-16 text-blue-600" />
              </div>
              <div className="ml-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : user.username || "User"}
                </h2>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${roleBadge.color}`}>
                <Shield className="w-3 h-3 inline mr-1" />
                {roleBadge.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}>
                <StatusIcon className="w-3 h-3 inline mr-1" />
                {statusBadge.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-800 border-gray-300">
                <Users className="w-3 h-3 inline mr-1" />
                Group ID: {user.groupId}
              </span>
            </div>

            {!isEditing && (
              <button
                onClick={startEditing}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profil
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Informasi Detail
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{user.username || "-"}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Email</label>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{user.email || "-"}</span>
              </div>
              {isEditing && (
                <p className="text-xs text-gray-400 mt-1">
                  Email tidak dapat diubah dari sini.
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Nama Depan</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="text-gray-700">{user.firstName || "-"}</div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Nama Belakang</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="text-gray-700">{user.lastName || "-"}</div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Nomor Telepon</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{user.phone || "-"}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Tanggal Bergabung</label>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editForm.subscribe_newsletter}
                    onChange={(e) => handleInputChange("subscribe_newsletter", e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                ) : (
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      user.subscribeNewsletter ? "bg-blue-600 border-blue-600" : "border-gray-300"
                    }`}
                  >
                    {user.subscribeNewsletter && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">Subscribe Newsletter</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">
                    Terima update dan informasi terbaru via email
                  </p>
                </div>
              </label>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan Perubahan
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Batal
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-600" />
            Keamanan Akun
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Password</p>
                <p className="text-sm text-gray-600">Reset lewat halaman "Lupa Password"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
