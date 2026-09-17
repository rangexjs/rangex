import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(() => ({
	mode: "development",
	server: { port: 3000 },
	resolve: { tsconfigPaths: true },
	worker: { format: "es" as const },
	plugins: [tailwindcss(), solid()],
}));
