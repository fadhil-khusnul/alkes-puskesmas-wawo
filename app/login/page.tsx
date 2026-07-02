export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-center mb-6">
          Login
        </h1>
        <p className="text-slate-500 mb-6 text-center text-sm">
          Masuk ke sistem Puskesmas Wawo
        </p>
        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
          Login (Demo)
        </button>
      </div>
    </div>
  );
}
