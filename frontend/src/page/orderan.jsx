import React, { useState, useEffect } from "react";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Phone,
  FileText,
  TrendingUp,
  RefreshCw
} from "lucide-react";

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); 

  const API_BASE_URL = "http://localhost:8080/v1";

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let url = `${API_BASE_URL}/project`;
      
      if (userId) {
        url = `${API_BASE_URL}/project/user/${userId}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const transformedOrders = transformBackendData(data.data || data);
      setOrders(transformedOrders);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const transformBackendData = (backendData) => {
    if (!Array.isArray(backendData)) {
      return [];
    }

    return backendData.map(item => ({
      id: item.ID || item.id,
      userId: item.user_id || item.UserID,
      projectTitle: item.project_title || item.ProjectTitle,
      category: item.category || item.Category,
      description: item.description || item.Description,
      skills: item.skills || item.Skills,
      contactName: item.contact_name || item.ContactName,
      contactPhone: item.contact_phone || item.ContactPhone,
      additionalNotes: item.additional_notes || item.AdditionalNotes || "",
      planTitle: item.plan_title || item.PlanTitle,
      planPriceRange: getPriceRange(item.plan_title || item.PlanTitle),
      status: item.status || item.Status || "pending",
      progress: calculateProgress(item.status || item.Status),
      createdAt: formatDate(item.created_at || item.CreatedAt),
      estimatedCompletion: calculateEstimatedCompletion(
        item.created_at || item.CreatedAt,
        item.plan_title || item.PlanTitle
      )
    }));
  };

  const getPriceRange = (planTitle) => {
    const priceRanges = {
      Starter: "Rp 3.000.000 - Rp 7.000.000",
      Professional: "Rp 7.000.000 - Rp 15.000.000",
      Business: "Rp 15.000.000 - Rp 30.000.000",
      Enterprise: "Rp 30.000.000 - Rp 100.000.000"
    };
    return priceRanges[planTitle] || "Hubungi kami";
  };

  const calculateProgress = (status) => {
    const progressMap = {
      pending: 0,
      in_progress: 45,
      revision: 75,
      completed: 100,
      cancelled: 0
    };
    return progressMap[status] || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const calculateEstimatedCompletion = (createdAt, planTitle) => {
    if (!createdAt) return "-";
    
    const daysToComplete = {
      Starter: 14,
      Professional: 30,
      Business: 60,
      Enterprise: 120
    };
    
    const days = daysToComplete[planTitle] || 30;
    const startDate = new Date(createdAt);
    const estimatedDate = new Date(startDate);
    estimatedDate.setDate(startDate.getDate() + days);
    
    return estimatedDate.toISOString().split('T')[0];
  };

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        `${API_BASE_URL}/project/${projectId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      fetchOrders();
      
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Gagal mengubah status project');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const statusConfig = {
    pending: {
      label: "Menunggu",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: Clock,
      iconColor: "text-yellow-600"
    },
    in_progress: {
      label: "Dalam Proses",
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: TrendingUp,
      iconColor: "text-blue-600"
    },
    revision: {
      label: "Revisi",
      color: "bg-orange-100 text-orange-800 border-orange-300",
      icon: AlertCircle,
      iconColor: "text-orange-600"
    },
    completed: {
      label: "Selesai",
      color: "bg-green-100 text-green-800 border-green-300",
      icon: CheckCircle,
      iconColor: "text-green-600"
    },
    cancelled: {
      label: "Dibatalkan",
      color: "bg-red-100 text-red-800 border-red-300",
      icon: XCircle,
      iconColor: "text-red-600"
    }
  };

  const planColors = {
    Starter: "from-blue-500 to-blue-600",
    Professional: "from-purple-500 to-purple-600",
    Business: "from-green-500 to-green-600",
    Enterprise: "from-orange-500 to-orange-600"
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    in_progress: orders.filter(o => o.status === "in_progress").length,
    completed: orders.filter(o => o.status === "completed").length
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat data orderan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Judul di tengah, tombol refresh di kanan */}
        <div className="mb-8 flex items-center justify-between relative">
          <div className="w-full text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Orderan</h1>
            <p className="text-gray-600">Pantau status dan progress semua proyek Anda</p>
          </div>
          <button
            onClick={fetchOrders}
            className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition absolute right-0 top-1/2 transform -translate-y-1/2"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orderan</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Menunggu</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dalam Proses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.in_progress}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Selesai</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-xl p-4 shadow-md mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "in_progress", "revision", "completed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  filterStatus === status
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "Semua" : statusConfig[status]?.label || status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-md">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-semibold">Tidak ada orderan</p>
              <p className="text-gray-500 text-sm">Orderan akan muncul di sini setelah Anda membuat pesanan</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status]?.icon || Package;
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleExpand(order.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {order.projectTitle}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusConfig[order.status]?.color}`}>
                            {statusConfig[order.status]?.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{order.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-6 h-6 ${statusConfig[order.status]?.iconColor}`} />
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Plan Badge */}
                    <div className={`inline-block bg-gradient-to-r ${planColors[order.planTitle] || "from-gray-500 to-gray-600"} text-white px-4 py-1 rounded-lg text-sm font-bold mb-4`}>
                      Paket {order.planTitle}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-blue-600">{order.progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            order.progress === 100
                              ? "bg-green-500"
                              : order.progress >= 75
                              ? "bg-blue-500"
                              : order.progress >= 50
                              ? "bg-yellow-500"
                              : "bg-orange-500"
                          }`}
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Dibuat: {order.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Target: {order.estimatedCompletion}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Detail Proyek
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-1">Deskripsi</p>
                              <p className="text-sm text-gray-700">{order.description}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-1">Skills Required</p>
                              <p className="text-sm text-gray-700">{order.skills}</p>
                            </div>
                            {order.additionalNotes && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-1">Catatan Tambahan</p>
                                <p className="text-sm text-gray-700">{order.additionalNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Column */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Informasi Kontak
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-1">Nama</p>
                              <p className="text-sm text-gray-700">{order.contactName}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-1">Telepon</p>
                              <p className="text-sm text-gray-700">{order.contactPhone}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <p className="text-xs font-semibold text-gray-500 mb-1">Range Harga</p>
                              <p className="text-lg font-bold text-blue-600">{order.planPriceRange}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;