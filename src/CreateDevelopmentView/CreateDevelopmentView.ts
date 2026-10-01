import {
	createRichTextEditor,
	type Extension,
	type StoredSnapshot,
} from "@rangex/rich-text-editor";
import { AccordionItem } from "@rangex/rich-text-editor/accordion-item";
import { Audio } from "@rangex/rich-text-editor/audio";
import { BlockQuote } from "@rangex/rich-text-editor/block-quote";
import { CodeBlock } from "@rangex/rich-text-editor/code-block";
import { CommandMenu } from "@rangex/rich-text-editor/command-menu";
import { Embed } from "@rangex/rich-text-editor/embed";
import { Emoji } from "@rangex/rich-text-editor/emoji";
import { EmptyMedia } from "@rangex/rich-text-editor/empty-media";
import { FindReplace } from "@rangex/rich-text-editor/find-replace";
import { Formatting } from "@rangex/rich-text-editor/formatting";
import { Image } from "@rangex/rich-text-editor/image";
import { LineHandler } from "@rangex/rich-text-editor/line-handler";
import { Link } from "@rangex/rich-text-editor/link";
import { List } from "@rangex/rich-text-editor/list";
import { Markdown } from "@rangex/rich-text-editor/markdown";
import {
	type GetMentionItemsParams,
	Mention,
} from "@rangex/rich-text-editor/mention";
import { ReadOnly } from "@rangex/rich-text-editor/read-only";
import { Separator } from "@rangex/rich-text-editor/separator";
import { Shortcuts } from "@rangex/rich-text-editor/shortcuts";
import { Symbols } from "@rangex/rich-text-editor/symbols";
import { Table } from "@rangex/rich-text-editor/table";
import { TemplateVariable } from "@rangex/rich-text-editor/template-variable";
import { TodoList } from "@rangex/rich-text-editor/todo-list";
import { UndoRedo } from "@rangex/rich-text-editor/undo-redo";
import { Video } from "@rangex/rich-text-editor/video";
import { createEditorHighlighter } from "@rangex/syntax-highlighter-shiki";
import storedSnapshot from "../MockDatabase/Demo.json" with { type: "json" };
import { mentionItems } from "../MockDatabase/MentionItems";
import {
	codeBlockLanguageDefinitions,
	codeBlockThemeDefinitions,
} from "./SyntaxHighlighter/CodeBlockSyntaxHighlighting";
import SyntaxHighlighterWorker from "./SyntaxHighlighter/SyntaxHighlighterWorker?worker";
import { templateVariableSettings } from "./TemplateVariable/TemplateVariableSettings";

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

/**
 * Demo-only stand-in for a user search — filters the mock users locally. A consumer building a real editor should
 * replace this with a request to their own user directory, passing `signal` along so stale requests get cancelled.
 */
const getMentionItems = async ({ query }: GetMentionItemsParams) => {
	const lowerQuery = query.toLowerCase();

	return mentionItems.filter((item) => {
		const displayName = item.displayName || item.userId;

		return displayName.toLowerCase().includes(lowerQuery);
	});
};

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
		Mention({ getItems: getMentionItems }),
		ReadOnly({}),
		Separator({}),
		Shortcuts({}),
		Symbols({}),
		Table({}),
		TemplateVariable(templateVariableSettings),
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
