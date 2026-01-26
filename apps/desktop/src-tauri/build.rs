fn main() {
    // 1. 编译 Proto 文件
    tonic_build::compile_protos("../../server/proto/virganol.proto")
        .expect("❌ Failed to compile protos! Check your path.");
    // 2. Tauri 默认构建
    tauri_build::build()
}
