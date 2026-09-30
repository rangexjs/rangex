import { createEditor } from "@rangex/editor";
import { render } from "@solidjs/web";
import type { UIOptions } from "#context";
import type { ExtensionComponents } from "#extensions";
import { App } from "../App";
import { defaultToolbarButtonsLayout } from "./_Utilities";
import type {
	CreateRichTextEditorParams,
	CreateRichTextEditorResult,
	RichTextEditor,
} from "./CreateRichTextEditor-types";
import "../ComponentStyles/global.css";
import { getEditorStyles } from "../EngineStyles";

export const createRichTextEditor = ({
	storedSnapshot,
	extensions,
	toolbarButtonsLayout = defaultToolbarButtonsLayout,
}: CreateRichTextEditorParams): CreateRichTextEditorResult => {
	const adapters = extensions.map(({ createAdapter }) => createAdapter());

	const styles = getEditorStyles();

	const { editor, host, floatingContainer, hostStyles } = createEditor({
		storedSnapshot,
		adapters,
		styles,
	});

	// TODO: `hostStyles` should be exposed via RichTextEditor and the user supposed to attach to the RootNode
	const styleSheet = new CSSStyleSheet();
	styleSheet.replaceSync(hostStyles);
	document.adoptedStyleSheets.push(styleSheet);

	const components = extensions.reduce<ExtensionComponents>(
		(prev, value) => {
			Object.assign(prev.toolbarButtons, value.components.toolbarButtons);
			prev.floatingComponents.push(...value.components.floatingComponents);

			return prev;
		},
		{ toolbarButtons: {}, floatingComponents: [] },
	);

	const uiOptions = extensions.reduce<UIOptions>(
		(prev, value) => Object.assign(prev, value.uiOptions),
		{},
	);

	for (const { register } of extensions) {
		register?.(editor);
	}

	const editorHost = document.createElement("div");

	const dispose = render(
		() => (
			<App
				components={components}
				uiOptions={uiOptions}
				toolbarButtonsLayout={toolbarButtonsLayout}
				editor={editor}
				host={host}
				floatingContainer={floatingContainer}
			/>
		),
		editorHost,
	);

	const richTextEditor: RichTextEditor = {
		get editorHost() {
			return editorHost;
		},

		createStoredSnapshot() {
			return editor.snapshot.createStored();
		},

		destroy() {
			editor.destroy();
			dispose();
		},
	};

	return richTextEditor;
};
