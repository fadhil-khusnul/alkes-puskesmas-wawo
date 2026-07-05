import Image from "next/image";
import { Info, MapPin, Building } from "lucide-react";

export default function TentangPage() {
  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Jumbotron / Slider (Static for now, simulating a slider) */}
      <div className="relative w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden mb-8 shadow-sm">
        <Image
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
          alt="Puskesmas Wawo"
          fill
          className="object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3">
            <span className="text-white font-bold text-3xl">-W-</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl leading-tight">
            Sistem Pengelolaan Alat Medis Digital <br />
            <span className="text-teal-400">Puskesmas Wawo</span>
          </h1>
          <p className="text-slate-200 max-w-2xl text-lg font-medium">
            Inovasi digital untuk efisiensi, transparansi, dan keamanan lingkungan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Informasi 1: Profil Puskesmas Wawo */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
            Profil Puskesmas Wawo
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base flex-1">
            Puskesmas Wawo adalah fasilitas layanan kesehatan masyarakat yang berlokasi di wilayah Kecamatan Wawo, Kabupaten Bima, Provinsi Nusa Tenggara Barat. Puskesmas ini telah berdiri sejak tahun 1970-an dan menjadi pusat rujukan bagi warga dari berbagai desa di wilayah tersebut. Fasilitas dan pelayanan vital yang tersedia di puskesmas ini meliputi Ruang Persalinan, Poli, Ruang Program, Kesehatan Ibu dan Anak, serta Ruang Laboratorium.
          </p>
        </div>

        {/* Card Informasi 2: Tentang Sistem Pengelolaan Alat Medis */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
            <Building className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
            Tentang Sistem Pengelolaan Alat Medis
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base flex-1">
            Sistem berbasis website ini dirancang khusus untuk mendigitalisasi proses pengelolaan alat medis padat yang berpotensi infeksius di Puskesmas Wawo, seperti jarum suntik, perban bekas, dan botol infus. Pengelolaan alat medis yang tidak optimal dapat menyebabkan dampak negatif seperti pencemaran lingkungan dan peningkatan risiko insiden kesehatan masyarakat. Oleh karena itu, sistem ini hadir untuk meningkatkan efisiensi proses operasional, mempercepat pemantauan, mengurangi beban pencatatan manual, dan mencegah kerusakan lingkungan.
          </p>
        </div>
      </div>
    </div>
  );
}
