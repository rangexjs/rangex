import { createEditor } from "@rangex/editor";
import { createReactiveEditor } from "@rangex/solid";
import { render } from "@solidjs/web";
import type { ExtensionComponents } from "#extensions";
import { App } from "../App";
import { defaultToolbarButtonsLayout } from "./_Utilities";
import type {
	CreateRichTextEditorParams,
	CreateRichTextEditorResult,
	RichTextEditor,
} from "./CreateRichTextEditor-types";
import "../ComponentStyles/global.css";
import { getEngineStyles } from "../EngineStyles";

export const createRichTextEditor = ({
	storedSnapshot,
	extensions,
	toolbarButtonsLayout = defaultToolbarButtonsLayout,
}: CreateRichTextEditorParams): CreateRichTextEditorResult => {
	const adapters = extensions.map(({ createAdapter }) => createAdapter());

	const styles = getEngineStyles();

	const { editor, host, floatingContainer, hostStyles } = createEditor({
		storedSnapshot,
		adapters,
		styles,
	});

	// TODO: `hostStyles` should be exposed via RichTextEditor and the user supposed to attach to the RootNode
	const styleSheet = new CSSStyleSheet();
	styleSheet.replaceSync(hostStyles);
	document.adoptedStyleSheets.push(styleSheet);

	const { reactiveEditor, disposeList } = createReactiveEditor({ editor });

	const components = extensions.reduce<ExtensionComponents>(
		(prev, value) => {
			Object.assign(prev.toolbarButtons, value.components.toolbarButtons);
			prev.floatingComponents.push(...value.components.floatingComponents);

			return prev;
		},
		{ toolbarButtons: {}, floatingComponents: [] },
	);

	for (const { register } of extensions) {
		register?.({ editor, reactiveEditor });
	}

	const editorHost = document.createElement("div");

	const dispose = render(
		() => (
			<App
				components={components}
				toolbarButtonsLayout={toolbarButtonsLayout}
				editor={editor}
				reactiveEditor={reactiveEditor}
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

		destroy() {
			for (const disposePort of disposeList) {
				disposePort();
			}

			editor.destroy();
			dispose();
		},
	};

	return richTextEditor;
};
