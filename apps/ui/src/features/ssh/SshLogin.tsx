import { useState, type ChangeEvent } from "react";
import { invoke } from "@tauri-apps/api/core";

// 复用之前的 InputField 组件逻辑 (可以提取到 components/ui)
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const InputField = ({ label, icon, ...props }: InputFieldProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl focus:border-indigo-500/50 outline-none text-sm transition-all`}
      />
    </div>
  </div>
);

export function SshLogin() {
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
      const response = await invoke<string>("test_ssh_params", formData);
      setStatus(response);
    } catch (err) {
      setStatus(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-100 p-8 space-y-6 relative">
      {/* 头部标题保留在这里或移到 App */}
      <div className="flex gap-4">
        <div className="flex-3">
          <InputField
            label="Remote Host"
            placeholder="127.0.0.1"
            value={formData.host}
            onChange={handleChange("host")}
          />
        </div>
        <div className="flex-1">
          <InputField
            label="Port"
            placeholder="22"
            value={formData.port}
            onChange={handleChange("port")}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <InputField
          label="User"
          placeholder="root"
          value={formData.username}
          onChange={handleChange("username")}
        />
        <InputField
          label="Secret"
          type="password"
          placeholder="••••"
          value={formData.password}
          onChange={handleChange("password")}
        />
      </div>
      <button
        onClick={handleConnect}
        disabled={loading}
        className={`w-full py-3.5 rounded-xl font-medium transition-all ${loading ? "bg-slate-800 text-slate-500" : "bg-white text-black active:scale-95"}`}
      >
        {loading ? "Establishing..." : "Connect Session"}
      </button>
      <p className="text-xs font-mono text-indigo-400/80 text-center">
        {status}
      </p>
    </section>
  );
}
