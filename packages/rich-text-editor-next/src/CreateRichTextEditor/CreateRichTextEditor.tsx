import { createEditor } from "@rangex/solid";
import { render } from "@solidjs/web";
import { App } from "../App";
import type {
	CreateRichTextEditorParams,
	CreateRichTextEditorResult,
	RichTextEditor,
} from "./CreateRichTextEditor-types";

export const createRichTextEditor = (
	params: CreateRichTextEditorParams,
): CreateRichTextEditorResult => {
	const { editor, host, floatingContainer } = createEditor(params);

	const editorHost = document.createElement("div");

	const dispose = render(
		() => (
			<App editor={editor} host={host} floatingContainer={floatingContainer} />
		),
		editorHost,
	);

	const richTextEditor: RichTextEditor = {
		get editorHost() {
			return editorHost;
		},

		destroy() {
			editor.destroy();
			dispose();
		},
	};

	return richTextEditor;
};
