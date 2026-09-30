import { defineConfig } from "vite";
import packageJson from "./package.json" with { type: "json" };

// Packages the consumer installs stay out of the bundle, subpath imports included.
// e.g. "rich-text-area" becomes /^rich-text-area(\/.*)?$/, matching "rich-text-area" and any "rich-text-area/…"
// subpath, but not "rich-text-area-foo".
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
