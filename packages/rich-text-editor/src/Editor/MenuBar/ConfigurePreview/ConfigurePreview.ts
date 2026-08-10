import { createSnapshotView as buildSnapshotView } from "rich-text-area";
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
	CreatePreviewContentParams,
	CreateRenderedParams,
	CreateSnapshotViewParams,
	CreateSnapshotViewTextParams,
	CreateStoredSnapshotParams,
	CreateStoredSnapshotTextParams,
} from "./ConfigurePreview-types";

const theme: DualTheme = { light: "light-plus", dark: "dark-plus" };

const createRendered = async ({ snapshotView }: CreateRenderedParams) => {
	const { style, rootElement, settled } = createHTMLFromSnapshotView({
		snapshotView,
	});
	await settled;

	return createHost({ children: [style, rootElement] });
};

const createHTML = async ({ snapshotView }: CreateHTMLParams) => {
	const { style, rootElement, settled } = createHTMLFromSnapshotView({
		snapshotView,
	});
	await settled;
	const template = createTemplate({ children: [rootElement, style] });
	const html = formatHTML({ element: template });
	const htmlPre = await createHighlightedCode({
		code: html,
		lang: "html",
		theme,
	});

	return createHost({ children: [htmlPre] });
};

const createSnapshotView = async ({
	snapshotView,
}: CreateSnapshotViewParams) => {
	const code = JSON.stringify(snapshotView, null, 2);
	const pre = await createHighlightedCode({ code, lang: "json", theme });

	return createHost({ children: [pre] });
};

const createStoredSnapshot = async ({
	storedSnapshot,
}: CreateStoredSnapshotParams) => {
	const code = JSON.stringify(storedSnapshot, null, 2);
	const pre = await createHighlightedCode({ code, lang: "json", theme });

	return createHost({ children: [pre] });
};

const createHTMLText = async ({ snapshotView }: CreateHTMLTextParams) => {
	const { style, rootElement, settled } = createHTMLFromSnapshotView({
		snapshotView,
	});
	await settled;
	const root = document.createElement("div");
	root.append(rootElement);
	const htmlCode = root.getHTML({ serializableShadowRoots: true });
	const styleCode = formatHTML({ element: style });

	const templateHTML = `<template shadowrootmode="open">${htmlCode}\n\n${styleCode}</template>`;

	return templateHTML;
};

const createSnapshotViewText = async ({
	snapshotView,
}: CreateSnapshotViewTextParams) => JSON.stringify(snapshotView);

const createStoredSnapshotText = async ({
	storedSnapshot,
}: CreateStoredSnapshotTextParams) => JSON.stringify(storedSnapshot);

/**
 * Returns one lazy getter per preview tab. Each getter builds its own DOM
 * tree from `snapshotView` when called, so the UI only pays for a tab once
 * the user actually views it.
 */
const createPreviewContent = ({ editorAPI }: CreatePreviewContentParams) => {
	const storedSnapshot = editorAPI.createStoredSnapshot();
	const { snapshotView } = buildSnapshotView({ storedSnapshot });

	return {
		getRendered: () => createRendered({ snapshotView }),
		getHTML: () => createHTML({ snapshotView }),
		getSnapshotView: () => createSnapshotView({ snapshotView }),
		getStoredSnapshot: () => createStoredSnapshot({ storedSnapshot }),
		getHTMLText: () => createHTMLText({ snapshotView }),
		getSnapshotViewText: () => createSnapshotViewText({ snapshotView }),
		getStoredSnapshotText: () => createStoredSnapshotText({ storedSnapshot }),
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
