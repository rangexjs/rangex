import { createMentionAdapter, type MentionSettings } from "#adapters/Mention";
import { configureMention } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Mention: AdapterFactoryFn<MentionSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createMentionAdapter(settings, options);

		const cleanup = configureMention({
			adapterBus: options.adapterBus,
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.mention = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
