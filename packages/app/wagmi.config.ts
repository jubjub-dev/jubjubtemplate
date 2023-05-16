import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20ABI } from "wagmi";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [{ name: "erc20", abi: erc20ABI }],
  plugins: [react()],
});
