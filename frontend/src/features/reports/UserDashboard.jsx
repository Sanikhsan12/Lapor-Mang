import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import { ThemeContext } from "../../shared/context/ThemeContext";
import { fetchWrapper } from "../../shared/utils/fetchWrapper";
import {
  LogOut,
  Plus,
  Image as ImageIcon,
  Activity,
  CheckCircle,
  Clock,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
} from "lucide-react";
import imageCompression from "browser-image-compression";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:5000";

const UserDashboard = () => {
  const { user, logoutAuth } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await fetchWrapper.get("/reports");
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      let photoToUpload = photo;
      if (photo) {
        setMsg({ type: "info", text: "Compressing image..." });
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        photoToUpload = await imageCompression(photo, options);
      }

      setMsg({ type: "info", text: "Uploading report..." });
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("photo", photoToUpload, photo.name);
      if (phone) formData.append("phone", phone);

      await fetchWrapper.post("/reports", formData, true);

      setMsg({ type: "success", text: "Report submitted successfully!" });
      setTitle("");
      setDescription("");
      setPhone("");
      setPhoto(null);
      loadReports();
    } catch (err) {
      setMsg({ type: "error", text: err.toString() });
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (msg.type === "success") setMsg({ type: "", text: "" });
      }, 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "under investigation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const stats = useMemo(() => {
    const total = reports.length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const pending = reports.filter((r) => r.status === "pending").length;
    return { total, resolved, pending };
  }, [reports]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark pt-8 px-4 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Welcome, {user.username}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Submit and track your health reports seamlessly
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={logoutAuth}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors bg-red-50 dark:bg-red-900/10 p-2 px-4 rounded-lg font-medium"
            >
              <LogOut size={20} />{" "}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-surface flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-xl dark:bg-blue-900/30 dark:text-blue-400">
              <Activity size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                Total Reports
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
          <div className="card-surface flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="bg-yellow-100 text-yellow-600 p-4 rounded-xl dark:bg-yellow-900/30 dark:text-yellow-400">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                Pending Processing
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats.pending}
              </p>
            </div>
          </div>
          <div className="card-surface flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="bg-green-100 text-green-600 p-4 rounded-xl dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                Successfully Resolved
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats.resolved}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Submit Form */}
          <div className="card-surface md:col-span-2">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
              <Plus className="text-primary" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                New Report
              </h2>
            </div>

            {msg.text && (
              <div
                className={`p-4 rounded-lg mb-6 text-sm flex items-center gap-2 border ${
                  msg.type === "error"
                    ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                    : msg.type === "info"
                      ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                      : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                }`}
              >
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Title
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Broken medical equipment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  className="input-field min-h-[100px]"
                  placeholder="Elaborate on the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  No. HP yang Dapat Dihubungi
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="tel"
                    className="input-field pl-9"
                    placeholder="e.g. 08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Opsional — membantu admin menghubungi kamu lebih cepat
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Photo Evidence
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-xl hover:border-primary transition-colors bg-slate-50 dark:bg-surface-dark-hover">
                  <div className="space-y-2 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                      <label className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 inline-block">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handlePhotoChange}
                          accept="image/*"
                          required
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">
                      Auto-compressed format support
                    </p>
                    {photo && (
                      <p className="text-sm font-bold text-primary mt-3 bg-primary/10 py-1 px-2 rounded-md inline-block">
                        {photo.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full btn-primary py-3 text-lg mt-2 font-bold shadow-lg shadow-primary/30"
              >
                {loading ? "Processing..." : "Submit Report"}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="card-surface flex flex-col md:col-span-3">
            <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">
              Recent Submissions
            </h2>
            <div
              className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar"
              style={{ maxHeight: "680px" }}
            >
              {reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-slate-500 mt-20 space-y-3">
                  <ImageIcon
                    size={48}
                    className="text-slate-300 dark:text-slate-600"
                  />
                  <p className="text-lg">No reports submitted yet.</p>
                  <p className="text-sm text-slate-400">
                    Use the form to create your first report.
                  </p>
                </div>
              ) : (
                reports.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 bg-white dark:bg-surface-dark transition-all hover:shadow-md overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1 pr-4">
                          {r.title}
                        </h3>
                        <span
                          className={`text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider ${getStatusColor(r.status)} shrink-0`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        {r.description}
                      </p>

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock size={13} />{" "}
                          {new Date(r.createdAt).toLocaleDateString()} at{" "}
                          {new Date(r.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {r.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={13} /> {r.phone}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <a
                          href={r.photoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-secondary hover:text-secondary-dark hover:underline flex gap-1 items-center bg-secondary/10 px-3 py-1.5 rounded-lg transition-colors font-medium text-xs"
                        >
                          <ImageIcon size={13} /> View Photo
                        </a>
                        {/* Toggle detail button */}
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === r.id ? null : r.id)
                          }
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          {expandedId === r.id ? (
                            <>
                              <ChevronUp size={14} /> Tutup Detail
                            </>
                          ) : (
                            <>
                              <ChevronDown size={14} /> Lihat Balasan Admin
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Admin Response Panel */}
                    {expandedId === r.id && (
                      <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare size={15} className="text-primary" />
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Balasan dari Admin
                          </span>
                        </div>
                        {r.adminResponse ? (
                          <p className="text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600 leading-relaxed">
                            {r.adminResponse}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                            Belum ada balasan dari admin. Harap tunggu — laporan
                            kamu sedang diproses.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
