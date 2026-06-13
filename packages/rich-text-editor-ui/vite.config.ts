import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: { port: 3300 },
	plugins: [tsconfigPaths(), tailwindcss(), solid()],
	build: {
		outDir: "dist",
		lib: {
			entry: "src/Production/index.ts",
			fileName: "index",
			formats: ["es"],
		},
	},
});
