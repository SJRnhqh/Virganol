// apps/desktop/src-tauri/build.rs
// TODO: standardize
// TODO: capabilites refine per-window later
// TODO: review tauri.conf.json fields

fn main() {
    // 1. 设置 PROTOC 环境变量 (防止找不到编译器)
    if let Ok(protoc_path) = protoc_bin_vendored::protoc_bin_path() {
        std::env::set_var("PROTOC", protoc_path);
    }

    // 2. 编译 Proto (加了详细日志打印)
    println!("cargo:warning=Compiling Protos...");
    let proto_result = tonic_build::configure().compile_protos(
        &[
            "../../server/proto/virganol/v1/base.proto",
            "../../server/proto/virganol/v1/config.proto",
        ],
        &["../../server/proto"],
    );

    // 如果 Proto 编译失败，打印警告但不要 panic，以免阻塞 Tauri 的构建
    if let Err(e) = proto_result {
        println!("cargo:warning=❌ Proto build failed: {}", e);
        // 注意：这里我们故意不 panic，是为了让下面的 tauri_build 能继续运行
        // 但如果 Proto 真的没编好，Rust 代码里引用 gRPC 的地方会报错，那是编译期错误，比这个 env var 错误好修
    }

    // 3. 执行 Tauri 构建 (这一步绝对不能少！)
    tauri_build::build();
}
