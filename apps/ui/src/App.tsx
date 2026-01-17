import { MainLayout } from "./layouts/MainLayout";
import { SshLogin } from "./features/ssh";

function App() {
  return (
    <MainLayout>
      {/* 以后这里可以通过状态判断，决定渲染 SshLogin 还是 AiAgent */}
      <SshLogin />
    </MainLayout>
  );
}

export default App;
