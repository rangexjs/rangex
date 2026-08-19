import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
	plugins: [tailwindcss(), solid()],
	worker: {
		format: "es",
	},
	build: {
		outDir: "dist",
		cssTarget: ["chrome150", "safari26", "firefox150"],
		lib: {
			entry: "src/index.ts",
			fileName: "index",
			formats: ["es"],
		},
	},
});
