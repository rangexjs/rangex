import { defaultClientConditions, defineConfig } from "vite-plus";

import packageJson from "./package.json" with { type: "json" };
import tsconfig from "./tsconfig.json" with { type: "json" };

// Packages the consumer installs stay out of the bundle, subpath imports included.
// e.g. "@rangex/core" becomes /^@rangex\/core(\/.*)?$/, matching "@rangex/core" and any "@rangex/core/…"
// subpath, but not "@rangex/core-foo".
const externalPackageNames = Object.keys(packageJson.dependencies);
const external = externalPackageNames.map((name) => new RegExp(`^${name}(/.*)?$`));

// One build entry per `exports` subpath, named after it, so "./link" builds src/Exports/Link/index.ts into dist/link.js.
const entry = Object.fromEntries(
	Object.entries(packageJson.exports).map(([subpath, conditions]) => {
		const name = subpath === "." ? "index" : subpath.slice(2);

		return [name, conditions["@rangex/source"]];
	}),
);

export default defineConfig({
	base: "./",
	resolve: {
		conditions: [...tsconfig.compilerOptions.customConditions, ...defaultClientConditions],
	},
	build: {
		target: ["chrome159", "firefox159", "safari27.3"],
		outDir: "dist",
		sourcemap: false,
		lib: {
			entry,
			formats: ["es"],
		},
		rolldownOptions: {
			external,
			output: { chunkFileNames: "_chunks/[name]-[hash].js" },
		},
	},
});
