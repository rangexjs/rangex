import { defineConfig } from "vite";

export default defineConfig({
	resolve: { tsconfigPaths: true },
	worker: {
		format: "es",
	},
	build: {
		outDir: "dist",
		lib: {
			entry: "src/index.ts",
			fileName: "index",
			formats: ["es"],
		},
	},
});
