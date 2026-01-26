

fn main() {
    std::env::set_var("PROTOC", protoc_bin_vendored::protoc_bin_path().unwrap());
    // 1. 编译 Proto 文件
    tonic_build::compile_protos("../../server/proto/virganol/v1/virganol.proto")
        .expect("❌ Failed to compile protos! Check your path.");
    // 2. Tauri 默认构建
    tauri_build::build()
}
