import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defaultClientConditions, defineConfig } from "vite";
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
			// WIDE_SCOPE_DEPS fires in dev only: the HMR proxy wraps every component in a memo, so a
			// parent inserting many components (EditorContainer's floating components) reads each one.
			// TODO: revisit once Solid 2.0 is released (currently an RC) — drop this if the warning no
			// longer counts HMR plumbing.
			performanceTracks: { attribution: { wideDeps: false } },
		}),
	],
}));
