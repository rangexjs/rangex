import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defaultClientConditions, defineConfig } from "vite";
import { devUploads } from "./configs/DevUploads";
import tsconfig from "./tsconfig.json" with { type: "json" };

export default defineConfig(() => ({
	mode: "development",
	server: { port: 3000 },
	resolve: {
		tsconfigPaths: true,
		conditions: [
			...tsconfig.compilerOptions.customConditions,
			...defaultClientConditions,
		],
	},
	plugins: [
		tailwindcss(),
		solid({
			performanceTracks: false,
		}),
		devUploads(),
	],
}));
