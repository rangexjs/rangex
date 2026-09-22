import {
	type CodeBlockSettings,
	createCodeBlockAdapter,
} from "#adapters/CodeBlock";
import { configureCodeBlock } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const CodeBlock: AdapterFactoryFn<CodeBlockSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createCodeBlockAdapter(settings, options);

		const cleanup = configureCodeBlock({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.codeBlock = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
