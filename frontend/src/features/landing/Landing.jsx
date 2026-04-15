import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../shared/context/ThemeContext';
import {
  Shield,
  Zap,
  Eye,
  Bell,
  ChevronRight,
  Megaphone,
  Sun,
  Moon,
  CheckCircle2,
  Clock3,
  Users,
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const features = [
    {
      icon: <Zap size={28} />,
      title: 'Penanganan Lebih Cepat',
      desc: 'Laporan yang masuk langsung diterima admin secara real-time. Tidak ada lagi laporan yang tertunda karena proses manual.',
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    {
      icon: <Shield size={28} />,
      title: 'Aman & Terpercaya',
      desc: 'Setiap laporan terverifikasi oleh akun pengguna yang terdaftar, memastikan data yang masuk akurat dan dapat dipertanggungjawabkan.',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      icon: <Eye size={28} />,
      title: 'Pantau Status Laporan',
      desc: 'Lihat status laporan kamu — dari Pending, Sedang Diinvestigasi, hingga Terselesaikan — kapan saja dan di mana saja.',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: <Bell size={28} />,
      title: 'Notifikasi Langsung',
      desc: 'Admin mendapat pemberitahuan instan setiap kali ada laporan baru masuk, sehingga respons bisa diberikan sesegera mungkin.',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
  ];

  const steps = [
    { icon: <Users size={22} />, text: 'Daftar & Login ke akun kamu' },
    { icon: <Megaphone size={22} />, text: 'Isi form laporan dengan foto sebagai bukti' },
    { icon: <Clock3 size={22} />, text: 'Admin menerima & menindaklanjuti laporan' },
    { icon: <CheckCircle2 size={22} />, text: 'Laporan terselesaikan & kamu mendapat update' },
  ];

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-slate-800 dark:text-white transition-colors duration-300">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl text-white shadow">
            <Megaphone size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Lapor <span className="text-primary">Mang</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            id="landing-login-btn"
            onClick={() => navigate('/login')}
            className="btn-primary px-5 py-2 text-sm"
          >
            Masuk / Daftar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-24 pb-16 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob animation-delay-2000 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20">
            <Zap size={14} />
            Platform Pelaporan Kesehatan Publik
          </div>

          <h1 className="text-5xl sm:text-6xl font-black mb-6 leading-tight">
            Selamat Datang di{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Lapor Mang
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Sampaikan laporan masalah kesehatanmu dengan mudah dan cepat.
            Setiap laporan yang masuk langsung ditangani oleh tim admin kami secara{' '}
            <span className="font-semibold text-primary">real-time</span> — karena kesehatanmu adalah prioritas kami.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              id="hero-lapor-btn"
              onClick={() => navigate('/login')}
              className="btn-primary px-8 py-4 text-lg font-bold shadow-xl shadow-primary/30 flex items-center gap-2 justify-center group"
            >
              Mulai Melapor Sekarang
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="hero-learnmore-btn"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 text-lg font-bold rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all"
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>

        {/* Floating stats */}
        <div className="relative z-10 mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto w-full">
          {[
            { val: 'Real-time', label: 'Notifikasi Admin' },
            { val: '< 24 Jam', label: 'Rata-rata Respons' },
            { val: '100%', label: 'Laporan Terdata' },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-md">
              <p className="text-xl font-black text-primary">{s.val}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Kenapa Pilih <span className="text-primary">Lapor Mang</span>?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Kami hadir untuk memastikan setiap suara masyarakat didengar dan ditindaklanjuti.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex gap-5 items-start"
              >
                <div className={`p-3 rounded-xl shrink-0 ${f.color}`}>{f.icon}</div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Cara Kerja <span className="text-secondary">Laporan</span></h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Hanya perlu 4 langkah mudah untuk laporan kamu diproses</p>
          </div>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-black text-lg shrink-0">
                  {i + 1}
                </div>
                <div className="flex items-center gap-3 text-primary/70">{step.icon}</div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Siap Melapor?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
            Bergabunglah dengan ribuan warga yang sudah mempercayakan laporan kesehatan mereka kepada Lapor Mang.
          </p>
          <button
            id="cta-login-btn"
            onClick={() => navigate('/login')}
            className="btn-primary px-10 py-4 text-xl font-bold shadow-xl shadow-primary/30 inline-flex items-center gap-2 group"
          >
            Login &amp; Laporan Sekarang
            <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800">
        © {new Date().getFullYear()} <span className="font-bold text-primary">Lapor Mang</span>. Platform Pelaporan Kesehatan Publik.
      </footer>
    </div>
  );
};

export default Landing;
