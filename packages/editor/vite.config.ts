import { defineConfig } from "vite";
import packageJson from "./package.json" with { type: "json" };

// Packages the consumer installs stay out of the bundle, subpath imports included.
// e.g. "@rangex/core" becomes /^@rangex\/core(\/.*)?$/, matching "@rangex/core" and any "@rangex/core/…"
// subpath, but not "@rangex/core-foo".
const externalPackageNames = Object.keys(packageJson.dependencies);
const external = externalPackageNames.map((name) => new RegExp(`^${name}(/.*)?$`));

export default defineConfig({
	base: "./",
	build: {
		outDir: "dist",
		sourcemap: false,
		lib: {
			entry: "src/index.ts",
			fileName: "index",
			formats: ["es"],
		},
		rolldownOptions: { external },
	},
});
