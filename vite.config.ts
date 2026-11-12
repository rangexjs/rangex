import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defaultClientConditions, defineConfig } from "vite-plus";

import { devUploads } from "./configs/DevUploads";
import tsconfig from "./tsconfig.json" with { type: "json" };

export default defineConfig(() => ({
	mode: "development",
	server: { port: 3000 },
	fmt: {
		useTabs: true,
		sortImports: {},
		sortPackageJson: false,
		ignorePatterns: ["**/*.md", "packages/core/**"],
	},
	lint: {
		plugins: ["eslint", "typescript", "unicorn", "oxc", "import", "jsx-a11y"],
		categories: { correctness: "error" },
		ignorePatterns: ["packages/core/**"],
		rules: {
			"import/no-default-export": "warn",
			"no-negated-condition": "warn",
			"typescript/parameter-properties": "warn",
			curly: ["warn", "all"],
			"typescript/prefer-for-of": "warn",
			"operator-assignment": ["warn", "always"],
			"typescript/array-type": ["warn", { default: "array" }],
			"no-empty": "warn",
			"no-empty-function": "warn",
			"no-unused-expressions": ["error", { allowShortCircuit: true }],
			"no-unused-vars": [
				"warn",
				{ ignoreRestSiblings: true, destructuredArrayIgnorePattern: "^_" },
			],
			"no-unassigned-vars": "off",
			"import/default": "off",
			"no-unused-private-class-members": "warn",
			"typescript/no-explicit-any": "error",
			"typescript/no-this-alias": "off",
			"unicorn/no-useless-spread": "off",
			"jsx-a11y/label-has-associated-control": "off",
			"jsx-a11y/click-events-have-key-events": "off",
			"jsx-a11y/aria-proptypes": "off",
			"jsx-a11y/prefer-tag-over-role": "off",
		},
		overrides: [
			{
				files: ["**/*.d.ts", "**/vite.config.ts"],
				rules: { "import/no-default-export": "off" },
			},
		],
	},
	resolve: {
		tsconfigPaths: true,
		conditions: [...tsconfig.compilerOptions.customConditions, ...defaultClientConditions],
	},
	plugins: [
		tailwindcss(),
		solid({
			performanceTracks: false,
		}),
		devUploads(),
	],
}));
