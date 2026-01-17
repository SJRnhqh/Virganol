import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [msg, setMsg] = useState("等待后端...");

  async function testBridge() {
    // 呼叫 Rust 里的 greet 函数，传参 name
    const response = await invoke<string>("greet", { name: "Virganol" });
    setMsg(response);
  }

  return (
    <div
      style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}
    >
      <h1>桥接测试</h1>
      <p>
        Rust后端回复: <b>{msg}</b>
      </p>
      <button
        onClick={testBridge}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        向 Rust 发送信号
      </button>
    </div>
  );
}

export default App;
