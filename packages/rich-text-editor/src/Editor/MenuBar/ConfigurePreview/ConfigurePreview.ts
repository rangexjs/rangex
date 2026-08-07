import { createSnapshotView } from "rich-text-area";
import type { DualTheme } from "#libs";
import { createHTMLFromSnapshotView } from "../../CreateHTMLFromSnapshotView";
import {
	createHighlightedCode,
	createHost,
	createTemplate,
	formatHTML,
} from "./_Utilities";
import type {
	ConfigurePreviewParams,
	CreateHTMLParams,
	CreateHTMLTextParams,
	CreateJSONParams,
	CreateJSONTextParams,
	CreatePreviewContentParams,
	CreateRenderedParams,
	CreateSnapshotParams,
	CreateSnapshotTextParams,
} from "./ConfigurePreview-types";

const theme: DualTheme = { light: "light-plus", dark: "dark-plus" };

const createRendered = ({ snapshotView }: CreateRenderedParams) => {
	const { style, rootElement } = createHTMLFromSnapshotView({ snapshotView });

	return createHost({ children: [style, rootElement] });
};

const createHTML = async ({ snapshotView }: CreateHTMLParams) => {
	const { style, rootElement } = createHTMLFromSnapshotView({ snapshotView });
	const template = createTemplate({ children: [rootElement, style] });
	const html = formatHTML({ element: template });
	const htmlPre = await createHighlightedCode({
		code: html,
		lang: "html",
		theme,
	});

	return createHost({ children: [htmlPre] });
};

const createJSON = async ({ snapshotView }: CreateJSONParams) => {
	const code = JSON.stringify(snapshotView, null, 2);
	const pre = await createHighlightedCode({ code, lang: "json", theme });

	return createHost({ children: [pre] });
};

const createSnapshot = async ({ storedSnapshot }: CreateSnapshotParams) => {
	const code = JSON.stringify(storedSnapshot, null, 2);
	const pre = await createHighlightedCode({ code, lang: "json", theme });

	return createHost({ children: [pre] });
};

const createHTMLText = ({ snapshotView }: CreateHTMLTextParams) => {
	const { style, rootElement } = createHTMLFromSnapshotView({
		snapshotView,
	});
	const root = document.createElement("div");
	root.append(rootElement);
	const htmlCode = root.getHTML({ serializableShadowRoots: true });
	const styleCode = formatHTML({ element: style });

	const templateHTML = `<template shadowrootmode="open">${htmlCode}\n\n${styleCode}</template>`;

	return templateHTML;
};

const createJSONText = ({ snapshotView }: CreateJSONTextParams) =>
	JSON.stringify(snapshotView);

const createSnapshotText = ({ storedSnapshot }: CreateSnapshotTextParams) =>
	JSON.stringify(storedSnapshot);

/**
 * Returns one lazy getter per preview tab. Each getter builds its own DOM
 * tree from `snapshotView` when called, so the UI only pays for a tab once
 * the user actually views it.
 */
const createPreviewContent = ({ editorAPI }: CreatePreviewContentParams) => {
	const storedSnapshot = editorAPI.createStoredSnapshot();
	const { snapshotView } = createSnapshotView({ storedSnapshot });

	return {
		getRendered: () => Promise.resolve(createRendered({ snapshotView })),
		getHTML: () => createHTML({ snapshotView }),
		getJSON: () => createJSON({ snapshotView }),
		getSnapshot: () => createSnapshot({ storedSnapshot }),
		getHTMLText: () => createHTMLText({ snapshotView }),
		getJSONText: () => createJSONText({ snapshotView }),
		getSnapshotText: () => createSnapshotText({ storedSnapshot }),
	};
};

export const configurePreview = ({
	richTextEditorUI,
	editorAPI,
}: ConfigurePreviewParams) => {
	const unsubscribe = richTextEditorUI.onMenuBar((params) => {
		if (params.type !== "preview") {
			return;
		}

		const content = createPreviewContent({ editorAPI });

		richTextEditorUI.updateMenuBarButtonState({ preview: { content } });
	});

	return () => {
		unsubscribe();
	};
};
