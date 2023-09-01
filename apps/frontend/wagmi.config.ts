import type { Abi } from "abitype";
import { defineConfig } from "@wagmi/cli";
import { erc, react } from "@wagmi/cli/plugins";
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";
import CartesiDApp from "@cartesi/rollups/export/artifacts/contracts/dapp/CartesiDApp.sol/CartesiDApp.json" assert { type: "json" };

export default defineConfig({
    out: "src/hooks/rollups.ts",
    contracts: [
        {
            name: CartesiDApp.contractName,
            abi: CartesiDApp.abi as Abi,
        },
    ],
    plugins: [
        erc(),
        hardhatDeploy({
            directory: "../../node_modules/@cartesi/rollups/export/abi",
        }),
        react(),
    ],
});
