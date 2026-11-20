import { readdirSync } from "node:fs";

import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defaultClientConditions, defineConfig } from "vite-plus";

import packageJson from "./package.json" with { type: "json" };
import tsconfig from "./tsconfig.json" with { type: "json" };

// Packages the consumer installs stay out of the bundle, subpath imports included.
// e.g. "@solidjs/web" becomes /^@solidjs\/web(\/.*)?$/, matching "@solidjs/web" and "@solidjs/web/jsx-runtime",
// but not "@solidjs/web-foo".
const externalPackageNames = Object.keys(packageJson.peerDependencies);
const external = externalPackageNames.map((name) => new RegExp(`^${name}(/.*)?$`));

// The root entry plus one per feature folder in src/Exports/, which the "./*" export maps to its subpath, each with its
// server entry: src/Exports/link/index.ts builds into dist/link.js and src/Exports/link/index.server.ts into
// dist/server/link.js, both imported as "@rangex/rich-text-editor/link".
const featureNames = readdirSync("src/Exports", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const entryDirectories = [
  ["index", "src/Exports"],
  ...featureNames.map((name) => [name, `src/Exports/${name}`]),
];

const entry = Object.fromEntries(
  entryDirectories.flatMap(([name, directory]) => [
    [name, `${directory}/index.ts`],
    [`server/${name}`, `${directory}/index.server.ts`],
  ]),
);

export default defineConfig({
  base: "./",
  plugins: [tailwindcss(), solid()],
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
