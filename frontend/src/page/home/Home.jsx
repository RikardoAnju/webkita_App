import React, { useState, useEffect } from "react";
import {
  Code2,
  Users,
  Zap,
  ArrowRight,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Sub-Komponen: ServiceCard ---
const ServiceCard = ({ icon: Icon, title, description, delay }) => (
  <div
    className="bg-white border border-gray-100 rounded-xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="p-4 bg-gray-900 text-white rounded-full inline-flex mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// --- Data Slider ---
const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    alt: "Team Working",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    alt: "Business Meeting",
  },
  {
    src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
    alt: "Office Collaboration",
  },
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    alt: "Modern Workspace",
  },
];

// --- Sub-Komponen: ImageSlider ---
const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideCount]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slideCount);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <div className="relative order-1 lg:order-2" data-aos="fade-left">
      <div
        className="relative overflow-hidden group"
        style={{
          borderRadius: "60px 60px 60px 60px",
          clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
        }}
      >
        <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
          {SLIDES.map((slide, index) => (
            <img
              key={index}
              src={slide.src}
              alt={slide.alt}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Komponen Utama: Home ---
const Home = ({ onStartClick }) => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1" data-aos="fade-right">
              <div className="inline-block">
                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold">
                  Platform Teknologi #1
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Hubungkan Bisnis Anda dengan Developer Terbaik
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Platform marketplace yang menghubungkan pembeli dengan developer profesional. 
                Kami mengelola pihak ketiga terpercaya untuk memastikan proyek website Anda berjalan lancar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={onStartClick}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center group"
                >
                  Mulai Sekarang
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold border-2 border-gray-900 hover:bg-gray-50 transition">
                  Pelajari Lebih Lanjut
                </button>
              </div>
              
              <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold text-sm">100k+ Pengguna</div>
                    <div className="text-sm text-gray-500">Bergabung dengan Kami</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div className="text-sm font-medium">Respon Cepat</div>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div className="text-sm font-medium">Garansi Keamanan</div>
                </div>
              </div>
            </div>
            <ImageSlider />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami menawarkan berbagai layanan pembuatan website yang profesional dan disesuaikan dengan kebutuhan bisnis Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={Code2}
              title="Pembuatan Website Kustom"
              description="Dari nol hingga siap pakai, kami rancang website yang unik, optimal, dan sesuai dengan identitas merek Anda."
              delay="100"
            />
            <ServiceCard
              icon={Zap}
              title="Integrasi E-commerce"
              description="Tingkatkan penjualan dengan toko online yang canggih, aman, dan terintegrasi dengan berbagai sistem pembayaran."
              delay="300"
            />
            <ServiceCard
              icon={Shield}
              title="Keamanan & Perawatan"
              description="Pastikan website Anda selalu aman, cepat, dan bebas dari masalah dengan dukungan teknis 24/7 kami."
              delay="500"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="bg-gray-900 rounded-3xl p-10 sm:p-16 text-center shadow-2xl"
            data-aos="zoom-in"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Siap Memulai Proyek Website Anda?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Jangan tunda lagi. Hubungi kami sekarang dan dapatkan konsultasi gratis untuk mewujudkan ide digital Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/6282171484751?text=Halo%20saya%20mau%20konsultasi"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition shadow-lg flex items-center justify-center"
              >
                Konsultasi Gratis
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;