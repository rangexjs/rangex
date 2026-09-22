import {
	AccordionItem,
	Audio,
	BlockQuote,
	CodeBlock,
	CommandMenu,
	createRichTextEditor,
	Embed,
	Emoji,
	EmptyMedia,
	type Extension,
	FindReplace,
	Formatting,
	Image,
	LineHandler,
	Link,
	List,
	Markdown,
	Mention,
	ReadOnly,
	Separator,
	Shortcuts,
	Symbols,
	Table,
	TemplateVariable,
	TodoList,
	UndoRedo,
	Video,
} from "@rangex/rich-text-editor";
import { createSyntaxHighlighter } from "@rangex/syntax-highlighter-shiki";
import type { StoredSnapshot } from "rich-text-area";
import storedSnapshot from "../MockDatabase/Demo-features.json";
import {
	codeBlockLanguageDefinitions,
	codeBlockThemeDefinitions,
} from "./SyntaxHighlighter/CodeBlockSyntaxHighlighting";
import SyntaxHighlighterWorker from "./SyntaxHighlighter/SyntaxHighlighterWorker?worker";

/**
 * Demo-only stand-in for a real upload — inlines the file as a base64 data URL instead of
 * sending it anywhere. A consumer building a real editor should replace this with a function
 * that uploads to their own storage and resolves the resulting URL.
 */
const uploadFile = ({
	file,
	onProgress,
}: {
	file: File;
	onProgress?: (progress: number) => void;
}): Promise<string | null> => {
	return new Promise((resolve) => {
		const reader = new FileReader();

		reader.onprogress = (event) => {
			if (event.lengthComputable) {
				onProgress?.(event.loaded / event.total);
			}
		};

		reader.onload = () => {
			resolve(reader.result as string);
		};

		reader.onerror = () => {
			resolve(null);
		};

		reader.readAsDataURL(file);
	});
};

const syntaxHighlighter = new SyntaxHighlighterWorker();
const getHighlightInfo = createSyntaxHighlighter(syntaxHighlighter);

const languages = [
	{ label: "Plain Text", value: null },
	...codeBlockLanguageDefinitions.map(({ label, value }) => ({ label, value })),
];

const themes = [
	{ label: "No Theme", value: null },
	...codeBlockThemeDefinitions.map(({ label, value }) => ({ label, value })),
];

const defaultTheme = (() => {
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

const codeBlockTriggers = [
	{ trigger: "", language: null },
	{ trigger: "ts", language: "typescript" },
	{ trigger: "js", language: "javascript" },
	{ trigger: "py", language: "python" },
	{ trigger: "html", language: "html" },
	{ trigger: "css", language: "css" },
	{ trigger: "json", language: "json" },
].map((codeBlockTrigger) => ({ ...codeBlockTrigger, theme: defaultTheme }));

export const createDevelopmentView = () => {
	const maxViewContainer = document.createElement("div");

	Object.assign<CSSStyleDeclaration, Partial<CSSStyleDeclaration>>(
		maxViewContainer.style,
		{
			display: "block flex",
			flexDirection: "column",
			gap: "30px",
			margin: "60px auto",
			maxWidth: "1200px",
		},
	);

	const extensions: Extension[] = [
		AccordionItem({}),
		Audio({}),
		BlockQuote({}),
		Embed({}),
		Emoji({}),
		EmptyMedia({ uploadFile }),
		FindReplace({}),
		Formatting({}),
		CodeBlock({ getHighlightInfo, languages, themes, defaultTheme }),
		CommandMenu({}),
		Image({}),
		LineHandler({}),
		Link({}),
		List({}),
		Markdown({ codeBlockTriggers }),
		Mention({}),
		ReadOnly({}),
		Separator({}),
		Shortcuts({}),
		Symbols({}),
		Table({}),
		TemplateVariable({}),
		TodoList({}),
		UndoRedo({}),
		Video({}),
	];

	const filledRichTextEditor = createRichTextEditor({
		storedSnapshot: storedSnapshot as StoredSnapshot,
		extensions,
	});

	maxViewContainer.append(filledRichTextEditor.editorHost);

	return maxViewContainer;
};
