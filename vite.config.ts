import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig(() => ({
	mode: "development",
	server: { port: 3000 },
	resolve: { tsconfigPaths: true },
	plugins: [tailwindcss(), solid()],
}));
