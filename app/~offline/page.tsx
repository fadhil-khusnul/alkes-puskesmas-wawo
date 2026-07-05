'use client';

export default function OfflineFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m2 2 20 20" />
            <path d="M8.5 8.5c.5-.3 1.1-.4 1.8-.5" />
            <path d="M10.8 4.8c1-.3 2.1-.4 3.2-.3" />
            <path d="M16.7 5.4c1.1.4 2.2 1.1 3 2.1" />
            <path d="M22 9a11.1 11.1 0 0 0-2.4-2.8" />
            <path d="M1.3 12.3a11.6 11.6 0 0 1 2.3-2.6" />
            <path d="M5.4 6.8c-.3.2-.6.4-.9.7" />
            <path d="M1.8 15.6a11.7 11.7 0 0 1-.5-2.2" />
            <path d="M22 14.5a11.5 11.5 0 0 0-.5-2.2" />
            <path d="M4.3 19.3c.4-.3.8-.5 1.2-.7" />
            <path d="M8.7 16c.3-.3.7-.5 1.1-.7" />
            <path d="M14.5 14.5c.3-.3.7-.5 1.1-.7" />
            <path d="M20.2 11.5c.4-.3.8-.5 1.2-.7" />
            <circle cx="12" cy="20" r="1" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Anda Sedang Offline</h1>
        <p className="text-slate-600 text-sm mb-6">
          Sepertinya Anda kehilangan koneksi internet (mungkin saat berada di ruang penyimpanan). Silakan periksa jaringan Wi-Fi atau Data Seluler Anda, lalu coba lagi.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors w-full"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
