import {
	createLineHandlerAdapter,
	type LineHandlerSettings,
} from "#adapters/LineHandler";
import { configureLineHandler } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const LineHandler: AdapterFactoryFn<LineHandlerSettings> = (
	settings,
) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createLineHandlerAdapter(settings, options);

		const cleanup = configureLineHandler({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.lineHandler = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
