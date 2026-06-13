import type { ConfigureMentionParams } from "./ConfigureMention-types";
import { handleMentionInsertion } from "./HandleMentionInsertion";
import { handlePopoverAppearance } from "./HandlePopoverAppearance";
import { handlePopoverClose } from "./HandlePopoverClose";
import { loadMentionItems } from "./LoadMentionItems";

export const configureMention = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureMentionParams) => {
	loadMentionItems({ richTextEditorUI });

	handleMentionInsertion({ richTextEditorUI, editorAPI });

	// handlePopoverClose must be subscribed before handlePopoverAppearance — both listen to
	// editorSelectionChangeEventType, and close must fire first to hide before appearance re-evaluates.
	handlePopoverClose({ richTextEditorUI, editorAPI });

	handlePopoverAppearance({ richTextEditorUI, editorAPI });
};
