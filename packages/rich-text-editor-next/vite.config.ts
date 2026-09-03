import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
	base: "./",
	plugins: [tailwindcss(), solid()],
	build: {
		outDir: "dist",
		lib: {
			entry: "src/index.ts",
			fileName: "index",
			formats: ["es"],
		},
	},
});
