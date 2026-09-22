import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	build: {
		outDir: "dist",
		lib: {
			entry: "src/index.ts",
			fileName: "index",
			formats: ["es"],
		},
	},
});
