import React, { useState, useEffect } from "react";
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
  Bell
} from "lucide-react";

const ProfileDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subscribeNewsletter: false
  });

  const API_BASE_URL = "http://localhost:8080/v1";

  // TEMPORARY: Mock data untuk testing jika API belum siap
  const useMockData = false; // Set true untuk testing dengan mock data

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    // Mock data untuk testing
    if (useMockData) {
      setTimeout(() => {
        const mockProfile = {
          id: 1,
          username: "johndoe",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          phone: "081234567890",
          group_id: 2,
          role: "pembeli",
          is_aktif: "Y",
          subscribe_newsletter: true,
          createdAt: "2024-01-15T10:30:00Z"
        };
        setProfile(mockProfile);
        setEditForm({
          username: mockProfile.username,
          firstName: mockProfile.first_name,
          lastName: mockProfile.last_name,
          email: mockProfile.email,
          phone: mockProfile.phone,
          subscribeNewsletter: mockProfile.subscribe_newsletter
        });
        setIsLoading(false);
      }, 1000);
      return;
    }
    
    try {
      // Coba ambil token dari berbagai sumber
      const token = sessionStorage.getItem('access_token') || 
                   localStorage.getItem('access_token') || 
                   '';
      
      console.log('Token:', token ? 'Found' : 'Not found');
      
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
      }
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Coba beberapa endpoint yang mungkin
      let response;
      let userData = null;
      
      // Endpoint 1: /user/me atau /auth/me (standar untuk get current user)
      try {
        console.log('Trying endpoint: /auth/me');
        response = await fetch(`${API_BASE_URL}/auth/me`, { headers });
        if (response.ok) {
          const data = await response.json();
          userData = data.data || data.user || data;
          console.log('Success with /auth/me');
        }
      } catch (e) {
        console.log('/auth/me failed:', e.message);
      }
      
      // Endpoint 2: /user/profile
      if (!userData) {
        try {
          console.log('Trying endpoint: /user/profile');
          response = await fetch(`${API_BASE_URL}/user/profile`, { headers });
          if (response.ok) {
            const data = await response.json();
            userData = data.data || data.user || data;
            console.log('Success with /user/profile');
          }
        } catch (e) {
          console.log('/user/profile failed:', e.message);
        }
      }
      
      // Endpoint 3: /users/me
      if (!userData) {
        try {
          console.log('Trying endpoint: /users/me');
          response = await fetch(`${API_BASE_URL}/users/me`, { headers });
          if (response.ok) {
            const data = await response.json();
            userData = data.data || data.user || data;
            console.log('Success with /users/me');
          }
        } catch (e) {
          console.log('/users/me failed:', e.message);
        }
      }

      if (!userData) {
        const errorText = await response?.text();
        console.error('Error response:', errorText);
        throw new Error(`Tidak dapat mengambil data profil. Status: ${response?.status}`);
      }
      
      console.log('Profile data received:', userData);
      
      if (!userData || !userData.username) {
        throw new Error('Data profil tidak valid atau kosong');
      }
      
      setProfile(userData);
      setEditForm({
        username: userData.username || "",
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        subscribeNewsletter: userData.subscribe_newsletter || false
      });
      
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Gagal memuat profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = sessionStorage.getItem('access_token') || 
                   localStorage.getItem('access_token') || 
                   '';
      
      console.log('Updating profile...');
      
      const response = await fetch(
        `${API_BASE_URL}/user/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: editForm.username,
            first_name: editForm.firstName,
            last_name: editForm.lastName,
            email: editForm.email,
            phone: editForm.phone,
            subscribe_newsletter: editForm.subscribeNewsletter
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error:', errorText);
        throw new Error('Gagal mengupdate profil');
      }

      console.log('Profile updated successfully');
      await fetchProfile();
      setIsEditing(false);
      setSuccessMessage('Profil berhasil diperbarui!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Gagal mengupdate profil: ' + err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      username: profile.username || "",
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      subscribeNewsletter: profile.subscribe_newsletter || false
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      pembeli: {
        label: "Pembeli",
        color: "bg-blue-100 text-blue-800 border-blue-300"
      },
      developer: {
        label: "Developer",
        color: "bg-purple-100 text-purple-800 border-purple-300"
      },
      admin: {
        label: "Admin",
        color: "bg-red-100 text-red-800 border-red-300"
      }
    };
    return roleConfig[role] || roleConfig.pembeli;
  };

  const getStatusBadge = (isAktif) => {
    return isAktif === "Y" 
      ? { label: "Aktif", color: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle }
      : { label: "Tidak Aktif", color: "bg-gray-100 text-gray-800 border-gray-300", icon: X };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gagal Memuat Profil</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(profile?.role);
  const statusBadge = getStatusBadge(profile?.is_aktif);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Profil Pengguna</h1>
            <p className="text-gray-600">Kelola informasi akun Anda</p>
          </div>
          <button
            onClick={fetchProfile}
            className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
          
          {/* Avatar Section */}
          <div className="relative px-6 pb-6">
            <div className="flex items-end -mt-16 mb-4">
              <div className="w-32 h-32 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center">
                <User className="w-16 h-16 text-blue-600" />
              </div>
              <div className="ml-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.first_name || profile?.last_name 
                    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                    : profile?.username || 'User'}
                </h2>
                <p className="text-gray-600">@{profile?.username}</p>
              </div>
            </div>

            {/* Badges */}
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
                Group ID: {profile?.group_id}
              </span>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profil
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Informasi Detail
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{profile?.username || '-'}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{profile?.email || '-'}</span>
                </div>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">
                Nama Depan
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="text-gray-700">
                  {profile?.first_name || '-'}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">
                Nama Belakang
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="text-gray-700">
                  {profile?.last_name || '-'}
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">
                Nomor Telepon
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{profile?.phone || '-'}</span>
                </div>
              )}
            </div>

            {/* Created At */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">
                Tanggal Bergabung
              </label>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(profile?.createdAt)}</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editForm.subscribeNewsletter}
                    onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                ) : (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    profile?.subscribe_newsletter 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-gray-300'
                  }`}>
                    {profile?.subscribe_newsletter && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      Subscribe Newsletter
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">
                    Terima update dan informasi terbaru via email
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleUpdateProfile}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Batal
              </button>
            </div>
          )}
        </div>

        {/* Security Info */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-600" />
            Keamanan Akun
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Password</p>
                <p className="text-sm text-gray-600">Terakhir diubah: -</p>
              </div>
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition">
                Ubah Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;