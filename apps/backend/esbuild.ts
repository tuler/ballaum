import { build, BuildOptions } from "esbuild";

const config: BuildOptions = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    // platform: "node", XXX: using platform web so it uses ethers esm package
    format: "esm",
    target: "esnext",
    outdir: "dist",
    inject: ["config/esbuild.inject.ts"],
};
build(config).catch(() => process.exit(1));
