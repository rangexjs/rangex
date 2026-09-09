import {
	createFindReplaceAdapter,
	type FindReplaceSettings,
} from "#adapters/FindReplace";
import { configureFindReplace } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const FindReplace: AdapterFactoryFn<FindReplaceSettings> = (
	settings,
) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createFindReplaceAdapter(settings, options);

		const cleanup = configureFindReplace({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.findReplace = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
