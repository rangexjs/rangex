import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";
import packageJson from "./package.json" with { type: "json" };

// Packages the consumer installs stay out of the bundle, subpath imports included.
// e.g. "@solidjs/web" becomes /^@solidjs\/web(\/.*)?$/, matching "@solidjs/web" and "@solidjs/web/jsx-runtime",
// but not "@solidjs/web-foo".
const externalPackageNames = Object.keys(packageJson.peerDependencies);
const external = externalPackageNames.map(
	(name) => new RegExp(`^${name}(/.*)?$`),
);

export default defineConfig({
	base: "./",
	plugins: [solid()],
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
