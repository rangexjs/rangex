import { createEditor } from "@rangex/editor";
import { render } from "@solidjs/web";

import type { UIOptions } from "#context";
import type { ExtensionComponents } from "#extensions";

import { App } from "../App";
import { getEditorStyles } from "../EngineStyles";
import { defaultToolbarButtonsLayout } from "./_Utilities";
import type {
	CreateRichTextEditorParams,
	CreateRichTextEditorResult,
	RichTextEditor,
} from "./CreateRichTextEditor-types";

import globalStyles from "../ComponentStyles/global.css?inline";

export const createRichTextEditor = ({
	licenseKey,
	storedSnapshot,
	snapshotSchema,
	extensions,
	toolbarButtonsLayout = defaultToolbarButtonsLayout,
}: CreateRichTextEditorParams): CreateRichTextEditorResult => {
	const adapters = extensions.map(({ createAdapter }) => createAdapter());

	const styles = getEditorStyles();

	const { editor, host, floatingContainer, hostStyles } = createEditor({
		licenseKey,
		storedSnapshot,
		snapshotSchema,
		adapters,
		styles,
	});

	const editorStyle = new CSSStyleSheet();
	editorStyle.replaceSync(globalStyles + hostStyles);

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

		get editorStyle() {
			return editorStyle;
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
