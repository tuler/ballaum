import { build, BuildOptions } from "esbuild";

const config: BuildOptions = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "esnext",
    outdir: "dist",
};
build(config).catch(() => process.exit(1));
