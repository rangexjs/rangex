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
			performanceTracks: {
				attribution: {
					// WIDE_SCOPE_DEPS fires in dev only: the HMR proxy wraps every component in a memo, so a
					// parent inserting many components (EditorContainer's floating components) reads each one.
					// TODO: revisit once Solid 2.0 is released (currently an RC) — drop this if the warning no
					// longer counts HMR plumbing.
					wideDeps: false,
					// HOT_SCOPE_RERUNS / HOT_SCOPE_FANOUT: dragging in ColorPanel's spectrum and sliders updates
					// the color once per pointermove (~frame rate), past the default 120/s on high-refresh
					// displays. Raised instead of disabled so runaway loops still surface.
					// TODO: revisit once Solid 2.0 is released (currently an RC).
					hotRuns: { count: 1000, windowMs: 1000 },
					// WASTED_RECOMPUTE: during those drags SpectrumColor's externalHsl memo sees its own update
					// echoed back as props.hsl on every move and returns the previous value by design (~2ms/s).
					// Budget raised from the default 2ms so only heavier waste surfaces.
					// TODO: revisit once Solid 2.0 is released (currently an RC).
					wastedRecompute: {
						minRuns: 5,
						ratio: 0.8,
						budgetMs: 10,
						windowMs: 1000,
					},
				},
			},
		}),
	],
}));
