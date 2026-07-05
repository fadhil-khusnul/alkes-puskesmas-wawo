"use client";

import { useState, useEffect } from "react";
import { getLandingSettings, updateLandingSettings } from "../actions";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LandingPageSetting() {
  const [formData, setFormData] = useState({
    hero_headline: "",
    hero_subheadline: "",
    slide1_title: "",
    slide1_subtitle: "",
    slide1_image: "/images/hero1.png",
    slide2_title: "",
    slide2_subtitle: "",
    slide2_image: "/images/hero2.png",
    slide3_title: "",
    slide3_subtitle: "",
    slide3_image: "/images/hero3.png",
    about_point1_title: "",
    about_point1_desc: "",
    about_point2_title: "",
    about_point2_desc: "",
    about_point3_title: "",
    about_point3_desc: "",
    profile_text: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function loadData() {
      try {
        const settings = await getLandingSettings();
        
        let slide1 = { title: "Digitalisasi Pengelolaan Alat Medis", subtitle: "Puskesmas Wawo, Kabupaten Bima", image: "/images/hero1.png" };
        let slide2 = { title: "Akurasi Pencatatan & Keamanan", subtitle: "Sistem Informasi Terkomputerisasi untuk Tenaga Medis", image: "/images/hero2.png" };
        let slide3 = { title: "Pelayanan Kesehatan Optimal", subtitle: "Mendukung pencegahan risiko infeksi dan pencemaran", image: "/images/hero3.png" };

        if (settings.hero_slides) {
          try {
            const parsed = JSON.parse(settings.hero_slides);
            if (Array.isArray(parsed)) {
              if (parsed[0]) slide1 = { ...slide1, ...parsed[0] };
              if (parsed[1]) slide2 = { ...slide2, ...parsed[1] };
              if (parsed[2]) slide3 = { ...slide3, ...parsed[2] };
            }
          } catch (e) {
            console.error("Error parsing hero slides JSON", e);
          }
        }

        setFormData({
          hero_headline: settings.hero_headline || "Digitalisasi Pengelolaan Alat Medis Puskesmas Wawo",
          hero_subheadline: settings.hero_subheadline || "Meningkatkan efisiensi, akurasi pencatatan, dan keamanan lingkungan dari alat medis berpotensi infeksius.",
          slide1_title: slide1.title,
          slide1_subtitle: slide1.subtitle,
          slide1_image: slide1.image,
          slide2_title: slide2.title,
          slide2_subtitle: slide2.subtitle,
          slide2_image: slide2.image,
          slide3_title: slide3.title,
          slide3_subtitle: slide3.subtitle,
          slide3_image: slide3.image,
          about_point1_title: settings.about_point1_title || "Efisiensi Pencatatan",
          about_point1_desc: settings.about_point1_desc || "Mengubah proses manual menjadi sistem komputerisasi digital untuk kecepatan dan ketepatan data.",
          about_point2_title: settings.about_point2_title || "Pemantauan Real-Time",
          about_point2_desc: settings.about_point2_desc || "Memantau jumlah dan status alat medis padat seperti jarum suntik, perban, dan botol infus secara langsung.",
          about_point3_title: settings.about_point3_title || "Mencegah Risiko",
          about_point3_desc: settings.about_point3_desc || "Pengelolaan yang baik mencegah dampak negatif pencemaran lingkungan dan insiden kesehatan di masyarakat.",
          profile_text: settings.profile_text || "Puskesmas Wawo merupakan ujung tombak pelayanan kesehatan dasar bagi masyarakat di berbagai desa di wilayah Kecamatan Wawo, Kabupaten Bima. Sistem ini didedikasikan untuk mendukung operasional para tenaga medis dalam memberikan pelayanan yang optimal, aman, dan berstandar tinggi.",
        });
      } catch (err: any) {
        console.error("Failed to load landing settings", err);
        setMessage({ type: "error", text: "Gagal memuat pengaturan landing page." });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const slide1 = { title: formData.slide1_title, subtitle: formData.slide1_subtitle, image: formData.slide1_image };
      const slide2 = { title: formData.slide2_title, subtitle: formData.slide2_subtitle, image: formData.slide2_image };
      const slide3 = { title: formData.slide3_title, subtitle: formData.slide3_subtitle, image: formData.slide3_image };
      const hero_slides = JSON.stringify([slide1, slide2, slide3]);

      const updates = {
        hero_headline: formData.hero_headline,
        hero_subheadline: formData.hero_subheadline,
        hero_slides: hero_slides,
        about_point1_title: formData.about_point1_title,
        about_point1_desc: formData.about_point1_desc,
        about_point2_title: formData.about_point2_title,
        about_point2_desc: formData.about_point2_desc,
        about_point3_title: formData.about_point3_title,
        about_point3_desc: formData.about_point3_desc,
        profile_text: formData.profile_text,
      };

      await updateLandingSettings(updates);
      setMessage({ type: "success", text: "Pengaturan Landing Page berhasil disimpan!" });
    } catch (err: any) {
      console.error("Failed to save settings", err);
      setMessage({ type: "error", text: err.message || "Gagal menyimpan pengaturan." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
          Pengaturan Landing Page
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sesuaikan slideshow jumbotron dan informasi teks halaman depan website Anda.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-sm mb-6 ${
            message.type === "error"
              ? "bg-rose-50 text-rose-600 border border-rose-100"
              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
          }`}
        >
          {message.type === "error" ? (
            <AlertCircle className="w-5 h-5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-slate-500 text-sm mt-4">Memuat data pengaturan...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 pb-12">
          {/* HERO SLIDER CONFIGURATION */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Slideshow Jumbotron (Hero Section)
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Headline Utama
                </label>
                <input
                  type="text"
                  value={formData.hero_headline}
                  onChange={(e) => setFormData({ ...formData, hero_headline: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                  placeholder="Headline Jumbotron"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Sub-Headline Utama
                </label>
                <input
                  type="text"
                  value={formData.hero_subheadline}
                  onChange={(e) => setFormData({ ...formData, hero_subheadline: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                  placeholder="Sub-headline Jumbotron"
                  required
                />
              </div>
            </div>

            {/* Individual Slides */}
            <div className="grid lg:grid-cols-3 gap-6 pt-4">
              {/* Slide 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-4">
                <span className="text-xs font-black text-teal-600 uppercase">Slide 1</span>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Judul Slide 1
                  </label>
                  <input
                    type="text"
                    value={formData.slide1_title}
                    onChange={(e) => setFormData({ ...formData, slide1_title: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Deskripsi Slide 1
                  </label>
                  <textarea
                    value={formData.slide1_subtitle}
                    onChange={(e) => setFormData({ ...formData, slide1_subtitle: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 h-16 resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Path File Gambar 1 (Lokal)
                    </label>
                    <input
                      type="text"
                      value={formData.slide1_image}
                      onChange={(e) => setFormData({ ...formData, slide1_image: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-100 text-slate-500 rounded-md text-xs cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-4">
                  <span className="text-xs font-black text-teal-600 uppercase">Slide 2</span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Judul Slide 2
                    </label>
                    <input
                      type="text"
                      value={formData.slide2_title}
                      onChange={(e) => setFormData({ ...formData, slide2_title: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Deskripsi Slide 2
                    </label>
                    <textarea
                      value={formData.slide2_subtitle}
                      onChange={(e) => setFormData({ ...formData, slide2_subtitle: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 h-16 resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Path File Gambar 2 (Lokal)
                    </label>
                    <input
                      type="text"
                      value={formData.slide2_image}
                      onChange={(e) => setFormData({ ...formData, slide2_image: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-100 text-slate-500 rounded-md text-xs cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                {/* Slide 3 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-4">
                  <span className="text-xs font-black text-teal-600 uppercase">Slide 3</span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Judul Slide 3
                    </label>
                    <input
                      type="text"
                      value={formData.slide3_title}
                      onChange={(e) => setFormData({ ...formData, slide3_title: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Deskripsi Slide 3
                    </label>
                    <textarea
                      value={formData.slide3_subtitle}
                      onChange={(e) => setFormData({ ...formData, slide3_subtitle: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 h-16 resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Path File Gambar 3 (Lokal)
                    </label>
                    <input
                      type="text"
                      value={formData.slide3_image}
                      onChange={(e) => setFormData({ ...formData, slide3_image: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-100 text-slate-500 rounded-md text-xs cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION TENTANG SISTEM CONFIG */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                Manfaat & Fitur Utama (Tentang Sistem)
              </h2>

              <div className="space-y-6">
                {/* Point 1 */}
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  <div className="font-semibold text-sm text-slate-700">Point 1 (Pencatatan)</div>
                  <div className="md:col-span-2 space-y-4">
                    <input
                      type="text"
                      value={formData.about_point1_title}
                      onChange={(e) => setFormData({ ...formData, about_point1_title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      placeholder="Judul Point 1"
                      required
                    />
                    <textarea
                      value={formData.about_point1_desc}
                      onChange={(e) => setFormData({ ...formData, about_point1_desc: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 h-20"
                      placeholder="Deskripsi Point 1"
                      required
                    />
                  </div>
                </div>

                {/* Point 2 */}
                <div className="grid md:grid-cols-3 gap-6 items-start pt-4 border-t border-slate-100">
                  <div className="font-semibold text-sm text-slate-700">Point 2 (Real-Time)</div>
                  <div className="md:col-span-2 space-y-4">
                    <input
                      type="text"
                      value={formData.about_point2_title}
                      onChange={(e) => setFormData({ ...formData, about_point2_title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      placeholder="Judul Point 2"
                      required
                    />
                    <textarea
                      value={formData.about_point2_desc}
                      onChange={(e) => setFormData({ ...formData, about_point2_desc: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 h-20"
                      placeholder="Deskripsi Point 2"
                      required
                    />
                  </div>
                </div>

                {/* Point 3 */}
                <div className="grid md:grid-cols-3 gap-6 items-start pt-4 border-t border-slate-100">
                  <div className="font-semibold text-sm text-slate-700">Point 3 (Pencegahan Risiko)</div>
                  <div className="md:col-span-2 space-y-4">
                    <input
                      type="text"
                      value={formData.about_point3_title}
                      onChange={(e) => setFormData({ ...formData, about_point3_title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                      placeholder="Judul Point 3"
                      required
                    />
                    <textarea
                      value={formData.about_point3_desc}
                      onChange={(e) => setFormData({ ...formData, about_point3_desc: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 h-20"
                      placeholder="Deskripsi Point 3"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION PROFIL PUSKESMAS WAWO CONFIG */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                Deskripsi Profil Puskesmas Wawo
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Teks Deskripsi Profil
                </label>
                <textarea
                  value={formData.profile_text}
                  onChange={(e) => setFormData({ ...formData, profile_text: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 h-32"
                  placeholder="Tulis sejarah/profil Puskesmas Wawo..."
                  required
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </div>
          </form>
        )}
      </div>
  );
}
