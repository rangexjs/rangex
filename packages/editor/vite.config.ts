import { readdirSync } from "node:fs";

import { defaultClientConditions, defineConfig } from "vite-plus";

import packageJson from "./package.json" with { type: "json" };
import tsconfig from "./tsconfig.json" with { type: "json" };

// Packages the consumer installs stay out of the bundle, subpath imports included.
// e.g. "@rangex/core" becomes /^@rangex\/core(\/.*)?$/, matching "@rangex/core" and any "@rangex/core/…"
// subpath, but not "@rangex/core-foo".
const externalPackageNames = Object.keys(packageJson.dependencies);
const external = externalPackageNames.map((name) => new RegExp(`^${name}(/.*)?$`));

// The root entry plus one per feature folder in src/Exports/, which the "./*" export maps to its subpath:
// src/Exports/link/index.ts builds into dist/link.js and is imported as "@rangex/editor/link".
const featureNames = readdirSync("src/Exports", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const entry = Object.fromEntries([
  ["index", "src/Exports/index.ts"],
  ...featureNames.map((name) => [name, `src/Exports/${name}/index.ts`]),
]);

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
