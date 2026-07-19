import { MentionAdapter } from "#adapters";
import { configureMention } from "#editor-extensions";
import { MentionPopover } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const Mention = createExtension({
	name: "mention",
	defaultSettings: {},
	createAdapter: (settings) => new MentionAdapter(settings),
	configure: ({ adapter, editorAPI }) =>
		configureMention({ mentionPort: adapter.port, editorAPI }),
	components: {
		popover: MentionPopover,
	},
});
