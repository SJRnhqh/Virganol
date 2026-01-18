import { useState } from "react";
import { useServerStore } from "../../store/useServerStore";
// 👆 修正：删除了未使用的 'type ServerConfig'

// --- InputField 组件 (保持不变) ---
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

// --- SettingsDialog 组件 (逻辑保持不变) ---
export function SettingsDialog() {
  const { isSettingsOpen, toggleSettings, addServer, testConnection } =
    useServerStore();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    host: "",
    port: "22",
    username: "",
    password: "",
  });

  if (!isSettingsOpen) return null;

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errorMsg) setErrorMsg("");
    };

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg("");

    const isSuccess = await testConnection({
      host: formData.host,
      port: formData.port,
      username: formData.username,
      password: formData.password,
    });

    setLoading(false);

    if (isSuccess) {
      addServer({
        name: formData.name || formData.host,
        host: formData.host,
        port: formData.port,
        username: formData.username,
        password: formData.password,
        errorMessage: undefined,
      });

      toggleSettings(false);
      setFormData({
        name: "",
        host: "",
        port: "22",
        username: "",
        password: "",
      });
    } else {
      setErrorMsg("Connection Failed: Please check your credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-[#2F3E46]/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      <div className="w-150 bg-[#FAF7F0] rounded-2xl shadow-2xl shadow-[#2F3E46]/20 border border-[#E6E1D3] overflow-hidden flex flex-col transform transition-all scale-100">
        {/* 顶部标题栏 */}
        <div className="h-14 bg-[#84A59D] flex items-center justify-between px-6 border-b border-[#E6E1D3]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FAF7F0] rounded-full animate-pulse" />
            <span className="text-[#FAF7F0] font-bold tracking-[0.2em] text-[10px] uppercase">
              New Research Node
            </span>
          </div>
          <button
            onClick={() => toggleSettings(false)}
            className="text-[#FAF7F0]/70 hover:text-white transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* 表单内容区 */}
        <div className="p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-[#2F3E46] font-light text-2xl tracking-tight">
              Configuration
            </h3>
            <p className="text-[10px] text-[#84A59D] uppercase tracking-widest">
              Enter server details to add to canvas
            </p>
          </div>

          {/* 错误提示条 */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-2 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <InputField
                label="Node Name (Alias)"
                placeholder="e.g. GPU Cluster Alpha"
                value={formData.name}
                onChange={handleChange("name")}
              />
            </div>
            <InputField
              label="Host IP"
              placeholder="192.168.1.1"
              value={formData.host}
              onChange={handleChange("host")}
            />
            <InputField
              label="Port"
              placeholder="22"
              value={formData.port}
              onChange={handleChange("port")}
            />
            <InputField
              label="Username"
              placeholder="root"
              value={formData.username}
              onChange={handleChange("username")}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange("password")}
            />
          </div>
        </div>

        {/* 底部按钮栏 */}
        <div className="p-6 bg-[#E6E1D3]/20 border-t border-[#E6E1D3] flex justify-end gap-3">
          <button
            onClick={() => toggleSettings(false)}
            className="px-6 py-3 text-[10px] font-bold text-[#84A59D] tracking-widest hover:bg-[#84A59D]/10 rounded-xl transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-8 py-3 bg-[#84A59D] text-[#FAF7F0] rounded-xl text-[10px] font-bold tracking-widest shadow-lg shadow-[#84A59D]/20 transition-all active:scale-95
              ${loading ? "opacity-70 cursor-wait" : "hover:bg-[#2F3E46] hover:shadow-xl"}
            `}
          >
            {loading ? "VERIFYING..." : "CONFIRM & ADD NODE"}
          </button>
        </div>
      </div>
    </div>
  );
}
