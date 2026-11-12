import type { CodeBlockExtensionSettings } from "@rangex/rich-text-editor/code-block";
import { createEditorHighlighter } from "@rangex/syntax-highlighter-shiki";

import {
	codeBlockLanguageDefinitions,
	codeBlockThemeDefinitions,
} from "./CodeBlockSyntaxHighlighting";
import SyntaxHighlighterWorker from "./SyntaxHighlighterWorker?worker";

const syntaxHighlighter = new SyntaxHighlighterWorker();
const getHighlightInfo = createEditorHighlighter(syntaxHighlighter);

const languages = [
	{ label: "Plain Text", value: null },
	...codeBlockLanguageDefinitions.map(({ label, value }) => ({ label, value })),
];

const themes = [
	{ label: "No Theme", value: null },
	...codeBlockThemeDefinitions.map(({ label, value }) => ({ label, value })),
];

export const defaultTheme = (() => {
	const light = themes.find(({ value }) => value === "light-plus")?.value;
	const dark = themes.find(({ value }) => value === "dark-plus")?.value;

	if (!light) {
		throw new Error("light-plus was not provided.");
	}

	if (!dark) {
		throw new Error("dark-plus was not provided.");
	}

	return { light, dark };
})();

export const codeBlockSettings: CodeBlockExtensionSettings = {
	getHighlightInfo,
	languages,
	themes,
	defaultTheme,
};
