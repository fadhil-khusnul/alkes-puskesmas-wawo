import LandingNavbar from "../components/LandingNavbar";
import LandingHero from "../components/LandingHero";
import { getLandingSettings } from "./actions";
import { Sparkles, Activity, ShieldAlert } from "lucide-react";
import Image from "next/image";

export const revalidate = 0;

export default async function Home() {
  const settings = await getLandingSettings();

  const heroHeadline = settings.hero_headline || "Digitalisasi Pengelolaan Alat Medis Puskesmas Wawo";
  const heroSubheadline = settings.hero_subheadline || "Meningkatkan efisiensi, akurasi pencatatan, dan keamanan lingkungan dari alat medis berpotensi infeksius.";
  const slidesJson = settings.hero_slides || "";

  const aboutPoint1Title = settings.about_point1_title || "Efisiensi Pencatatan";
  const aboutPoint1Desc = settings.about_point1_desc || "Mengubah proses manual menjadi sistem komputerisasi digital untuk kecepatan dan ketepatan data.";
  const aboutPoint2Title = settings.about_point2_title || "Pemantauan Real-Time";
  const aboutPoint2Desc = settings.about_point2_desc || "Memantau jumlah dan status alat medis padat seperti jarum suntik, perban, dan botol infus secara langsung.";
  const aboutPoint3Title = settings.about_point3_title || "Mencegah Risiko";
  const aboutPoint3Desc = settings.about_point3_desc || "Pengelolaan yang baik mencegah dampak negatif pencemaran lingkungan dan insiden kesehatan di masyarakat.";

  const profileText = settings.profile_text || "Puskesmas Wawo merupakan ujung tombak pelayanan kesehatan dasar bagi masyarakat di berbagai desa di wilayah Kecamatan Wawo, Kabupaten Bima. Sistem ini didedikasikan untuk mendukung operasional para tenaga medis dalam memberikan pelayanan yang optimal, aman, dan berstandar tinggi.";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* 1. NAVBAR */}
      <LandingNavbar />

      {/* 2. HERO SECTION */}
      <LandingHero
        slidesJson={slidesJson}
        fallbackHeadline={heroHeadline}
        fallbackSubheadline={heroSubheadline}
      />

      {/* 3. SECTION TENTANG SISTEM */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-teal-600 font-bold uppercase tracking-wider text-xs px-3 py-1 bg-teal-55 rounded-full">
            Fitur Utama
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Sistem Pengelolaan Alat Medis Modern
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-4 leading-relaxed">
            Menghadirkan solusi digital mutakhir untuk efisiensi operasional harian Puskesmas Wawo demi keselamatan petugas dan masyarakat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-500/20 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-3">
              {aboutPoint1Title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              {aboutPoint1Desc}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-500/20 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-3">
              {aboutPoint2Title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              {aboutPoint2Desc}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-500/20 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-3">
              {aboutPoint3Title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              {aboutPoint3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECTION PROFIL PUSKESMAS WAWO */}
      <section className="py-24 bg-white border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[350px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-100">
            <Image
              src="/images/puskesmas.png"
              alt="Fasilitas Puskesmas Wawo"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="text-teal-600 font-bold uppercase tracking-wider text-xs px-3 py-1 bg-teal-50 rounded-full">
              Profil Fasilitas
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Puskesmas Wawo, Kabupaten Bima
            </h2>
            <p className="text-base text-slate-600 leading-relaxed font-light">
              {profileText}
            </p>
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-6">
              <div>
                <p className="text-2xl font-black text-teal-600">Pelayanan</p>
                <p className="text-xs text-slate-500 mt-1">Dasar & Rawat Jalan</p>
              </div>
              <div>
                <p className="text-2xl font-black text-teal-600">Aman & Higienis</p>
                <p className="text-xs text-slate-500 mt-1">Standar Akreditasi Kemenkes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-extrabold text-white text-lg tracking-tight">
              Sistem Alat Medis Wawo
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Puskesmas Wawo, Kabupaten Bima, Nusa Tenggara NTB.
            </p>
          </div>
          <p className="text-xs text-center md:text-right font-light">
            &copy; 2025 Sistem Pengelolaan Alat Medis Puskesmas Wawo. Dibuat untuk meningkatkan efisiensi dan pelayanan.
          </p>
        </div>
      </footer>
    </div>
  );
}
