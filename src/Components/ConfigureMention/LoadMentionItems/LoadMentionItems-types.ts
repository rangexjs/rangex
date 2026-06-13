import type {
	MentionPopoverState,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";

export type MentionItems = NonNullable<MentionPopoverState["items"]>;

export interface LoadMentionItemsParams {
	richTextEditorUI: RichTextEditorUI;
}
