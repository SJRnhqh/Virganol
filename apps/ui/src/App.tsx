import { useState, type ChangeEvent } from "react";
import { invoke } from "@tauri-apps/api/core";

// 为子组件定义明确的接口
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
}

const InputField = ({ label, icon, ...props }: InputFieldProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl
                   focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none
                   transition-all placeholder:text-slate-700 text-sm`}
      />
    </div>
  </div>
);

function App() {
  const [formData, setFormData] = useState({
    host: "",
    port: "22",
    username: "",
    password: "",
  });
  const [status, setStatus] = useState("System Standby");
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  async function handleConnect() {
    setLoading(true);
    setStatus("Initiating encrypted tunnel...");
    try {
      // 传递完整的 formData (包含 host, port, username, password)
      const response = await invoke<string>("test_ssh_params", formData);
      setStatus(response);
    } catch (err) {
      setStatus(`Connection Error: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-125 h-75 bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <main className="relative w-full max-w-100 p-8">
        <header className="mb-10 space-y-2">
          <h1 className="text-3xl font-light tracking-[0.2em] text-white uppercase text-center">
            Virga<span className="font-bold text-indigo-500">nol</span>
          </h1>
          <div className="h-px w-12 bg-indigo-500/50 mx-auto" />
        </header>

        <section className="space-y-6">
          {/* 第一行：Host (3份宽度) + Port (1份宽度) */}
          <div className="flex gap-4">
            <div className="flex-3">
              <InputField
                label="Remote Host"
                placeholder="127.0.0.1"
                value={formData.host}
                onChange={handleChange("host")}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                }
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Port"
                placeholder="22"
                value={formData.port}
                onChange={handleChange("port")}
                icon={null}
              />
            </div>
          </div>

          {/* 第二行：User + Secret (对等宽度) */}
          <div className="flex gap-4">
            <InputField
              label="User"
              placeholder="root"
              value={formData.username}
              onChange={handleChange("username")}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />
            <InputField
              label="Secret"
              type="password"
              placeholder="••••"
              value={formData.password}
              onChange={handleChange("password")}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            />
          </div>

          <button
            onClick={handleConnect}
            disabled={loading}
            className={`w-full py-3.5 mt-2 rounded-xl font-medium tracking-wide transition-all
              ${
                loading
                  ? "bg-slate-800 text-slate-500 cursor-wait"
                  : "bg-white text-black hover:bg-indigo-50 shadow-[0_0_20px_rgba(255,255,255,0.05)] active:scale-95"
              }`}
          >
            {loading ? "Establishing..." : "Connect Session"}
          </button>
        </section>

        <footer className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full mb-4">
            <div
              className={`w-1.5 h-1.5 rounded-full ${loading ? "bg-yellow-500 animate-pulse" : "bg-indigo-500"}`}
            />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              {loading ? "Process Active" : "Link Stable"}
            </span>
          </div>
          <p className="text-xs font-mono text-indigo-400/80 line-clamp-2 min-h-[3em]">
            {status}
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
