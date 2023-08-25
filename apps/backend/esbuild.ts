import { build, BuildOptions } from "esbuild";

const config: BuildOptions = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    outdir: "dist",
};
build(config).catch(() => process.exit(1));
