import type { MentionPopoverState, RichTextEditorUI } from "#ui";

export type MentionItems = NonNullable<MentionPopoverState["items"]>;

export interface LoadMentionItemsParams {
	richTextEditorUI: RichTextEditorUI;
}
