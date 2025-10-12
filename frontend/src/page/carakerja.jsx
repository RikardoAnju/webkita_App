import React from "react";

import {
  Play,
  Globe,
  Database,
  Users,
  CheckCircle,
  XCircle,
  TestTube,
  RefreshCw,
  FileCheck,
  Wrench,
  CheckSquare,
} from "lucide-react";

const STEP_TYPES = {
  START: "start",
  PROCESS: "process",
  DECISION: "decision",
  REVISION: "revision",
  END: "end",
};

// --- Komponen Utama ---

const CaraKerja = ({ onBackToHome }) => {
  const stepsData = [
    {
      id: 1,
      title: "Mulai Pemesanan",
      description: "Klien memulai proses pemesanan layanan website.",
      icon: Play,
      type: STEP_TYPES.START,
    },
    {
      id: 2,
      title: "Akses Website Webkita",
      description:
        "Klien mengakses website Webkita untuk melakukan pemesanan layanan.",
      icon: Globe,
      type: STEP_TYPES.PROCESS,
    },
    {
      id: 3,
      title: "Pencatatan Data & Informasi",
      description:
        "Sistem mencatat data pesanan dan meneruskan informasi kepada tim pengembang.",
      icon: Database,
      type: STEP_TYPES.PROCESS,
    },
    {
      id: 4,
      title: "Analisis Kebutuhan",
      description:
        "Tim pengembang menganalisis kebutuhan klien, menyusun rencana proyek, dan estimasi biaya.",
      icon: Users,
      type: STEP_TYPES.PROCESS,
    },
    {
      id: 5,
      title: "Presentasi Penawaran & Keputusan Klien",
      description:
        "Tim mempresentasikan penawaran. Jika diterima (YA): Lanjut ke Pembangunan. Jika ditolak (TIDAK): Proses selesai atau negosiasi ulang.",
      icon: CheckCircle,
      type: STEP_TYPES.DECISION,
    },
    {
      id: 6,
      title: "Proses Pembangunan Website",
      description:
        "Tim pengembang melaksanakan proses pembangunan website sesuai dengan kebutuhan dan spesifikasi klien.",
      icon: Wrench,
      type: STEP_TYPES.PROCESS,
    },
    {
      id: 7,
      title: "Testing Internal (QA)",
      description:
        "Tim Quality Assurance (QA) melakukan uji coba internal yang ketat terhadap hasil pengembangan.",
      icon: TestTube,
      type: STEP_TYPES.PROCESS,
    },
    {
      id: 8,
      title: "Finalisasi Hasil Uji Coba",
      description:
        "Hasil testing diverifikasi. Jika Lolos (YA): Lanjut ke Serah Terima. Jika Tidak Lolos (TIDAK): Masuk ke Perbaikan/Revisi.",
      icon: CheckSquare,
      type: STEP_TYPES.DECISION,
    },
    {
      id: 9,
      title: "Perbaikan/Revisi Produk",
      description:
        "Tim melakukan perbaikan dan revisi berdasarkan temuan uji coba (bug, penyesuaian). Setelah revisi, kembali ke tahap Testing Internal.",
      icon: RefreshCw,
      type: STEP_TYPES.REVISION,
    },
    {
      id: 10,
      title: "Serah Terima Proyek",
      description:
        "Tim menyelesaikan finalisasi produk dan melakukan serah terima proyek (penyerahan kode, aset, dokumentasi) kepada klien.",
      icon: FileCheck,
      type: STEP_TYPES.PROCESS,
    },
    {
      id: 11,
      title: "Maintenance & Support",
      description:
        "Tim menyediakan layanan pemeliharaan (maintenance) dan dukungan (support) pasca-proyek.",
      icon: Wrench,
      type: STEP_TYPES.PROCESS,
    },
    {
      id: 12,
      title: "Proses Selesai",
      description: "Proses produksi website telah selesai dengan sukses.",
      icon: CheckCircle,
      type: STEP_TYPES.END,
    },
  ];

  const getIconColor = (type) => {
    switch (type) {
      case STEP_TYPES.START:
      case STEP_TYPES.END:
        return "text-white bg-green-500";
      case STEP_TYPES.DECISION:
        return "text-white bg-yellow-500";
      case STEP_TYPES.REVISION:
        return "text-white bg-orange-500";
      case STEP_TYPES.PROCESS:
      default:
        return "text-white bg-gray-900";
    }
  };

  const StepCard = ({ step }) => {
    const Icon = step.icon;
    const iconStyle = getIconColor(step.type);

    return (
      <div
        className="bg-white border border-gray-100 rounded-xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
        data-aos="fade-up"
      >
        {/* Icon */}
        <div className={`p-4 rounded-full inline-flex mb-4 ${iconStyle}`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {step.id}. {step.title}
        </h3>
        <p className="text-gray-600">{step.description}</p>

        {step.type === STEP_TYPES.DECISION && (
          <div className="mt-4 space-y-2 text-sm font-medium text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="flex items-center">
              <CheckCircle className="inline w-4 h-4 text-green-500 mr-2" />
              <span>Ya: Lanjut ke langkah berikutnya</span>
            </p>
            <p className="flex items-center">
              <XCircle className="inline w-4 h-4 text-red-500 mr-2" />
              <span>Tidak: Proses ulang/negosiasi</span>
            </p>
          </div>
        )}

        {step.type === STEP_TYPES.REVISION && (
          <div className="mt-4 text-sm font-semibold p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-orange-600 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Kembali ke Testing Internal (#7)
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Konten Halaman Cara Kerja */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16" data-aos="fade-up">
            <div className="inline-block mb-4">
              <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold">
                Proses Kerja Kami
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Cara Kerja Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Langkah demi langkah dalam proses pengembangan website profesional
              bersama Webkita.
            </p>
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stepsData.map((step) => (
              <StepCard key={step.id} step={step} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaraKerja;
