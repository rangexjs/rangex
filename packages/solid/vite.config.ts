import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	plugins: [solid()],
	build: {
		outDir: "dist",
		lib: {
			entry: "src/index.ts",
			fileName: "index",
			formats: ["es"],
		},
	},
});
