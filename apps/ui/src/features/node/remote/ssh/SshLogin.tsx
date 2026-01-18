import { useState, type ChangeEvent } from "react";
import { invoke } from "@tauri-apps/api/core";

// 1. 内部组件：适配“茯葭”审美的输入框
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputField = ({ label, ...props }: InputFieldProps) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[10px] font-bold text-[#84A59D] uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-white/40 border border-[#E6E1D3] rounded-xl
        text-[#2F3E46] placeholder:text-[#2F3E46]/20 text-sm
        focus:bg-white/80 focus:border-[#84A59D] focus:ring-4 focus:ring-[#84A59D]/5
        outline-none transition-all duration-500"
    />
  </div>
);

// 2. 主组件
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
    setStatus("Initiating link...");
    try {
      const response = await invoke<string>("test_ssh_params", formData);
      setStatus(response);
    } catch (err) {
      setStatus(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  // --- 刚才报错的 return 必须在这里面 ---
  return (
    <section className="w-full max-w-2xl px-12 py-16 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-light text-[#2F3E46] tracking-tight">
          Establish Research Link
        </h2>
        <p className="text-[10px] text-[#84A59D] uppercase tracking-[0.25em] opacity-70">
          Secure Shell Protocol // V.I.N.E. Node Gateway
        </p>
        <div className="h-px w-12 bg-[#E6E1D3] mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-4 gap-x-10 gap-y-8">
        <div className="col-span-3">
          <InputField
            label="Remote Host"
            placeholder="127.0.0.1"
            value={formData.host}
            onChange={handleChange("host")}
          />
        </div>
        <div className="col-span-1">
          <InputField
            label="Port"
            placeholder="22"
            value={formData.port}
            onChange={handleChange("port")}
          />
        </div>
        <div className="col-span-2">
          <InputField
            label="Identifier"
            placeholder="username"
            value={formData.username}
            onChange={handleChange("username")}
          />
        </div>
        <div className="col-span-2">
          <InputField
            label="Secret Key"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange("password")}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 pt-4">
        <button
          onClick={handleConnect}
          disabled={loading}
          className={`group relative w-72 py-4 rounded-full font-bold tracking-[0.3em] text-[10px] uppercase transition-all duration-700
            ${
              loading
                ? "bg-[#E6E1D3] text-[#84A59D] cursor-wait"
                : "bg-[#84A59D] text-[#FAF7F0] hover:bg-[#2F3E46] hover:shadow-[0_20px_50px_rgba(132,165,157,0.2)] active:scale-[0.98]"
            }`}
        >
          {loading ? "Syncing..." : "Initialize Session"}
        </button>

        <div className="h-4 flex items-center">
          <p className="text-[9px] font-mono text-[#84A59D] tracking-[0.2em] uppercase opacity-60">
            {status}
          </p>
        </div>
      </div>

      {/* 装饰细节 */}
      <div className="absolute -bottom-4 right-12 text-[40px] font-black text-[#84A59D]/5 italic select-none pointer-events-none">
        01
      </div>
    </section>
  );
}
