import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => ({
	mode: "development",
	server: { port: 3000 },
	plugins: [tsconfigPaths()],
}));
