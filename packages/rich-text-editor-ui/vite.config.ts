import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
	server: { port: 3300 },
	resolve: { tsconfigPaths: true },
	plugins: [tailwindcss(), solid()],
	build: {
		outDir: "dist",
		lib: {
			entry: "src/Production/index.ts",
			fileName: "index",
			formats: ["es"],
		},
	},
});
