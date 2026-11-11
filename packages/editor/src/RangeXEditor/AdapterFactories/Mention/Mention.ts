import { createMentionAdapter, type MentionSettings } from "#adapters/Mention";
import { configureMention } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Mention: AdapterFactoryFn<MentionSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createMentionAdapter(settings, options);

		editor.mention = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureMention({
					adapterBus: options.adapterBus,
					configPort: adapter.configPort,
					editorAPI,
				});

				return () => {
					cleanup();
				};
			},
		};
	};
};
