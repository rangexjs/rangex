import {
	createRichTextEditor,
	type Extension,
	type SnapshotLimits,
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
import { Mention } from "@rangex/rich-text-editor/mention";
import { ReadOnly } from "@rangex/rich-text-editor/read-only";
import { Separator } from "@rangex/rich-text-editor/separator";
import { Shortcuts } from "@rangex/rich-text-editor/shortcuts";
import { Symbols } from "@rangex/rich-text-editor/symbols";
import { Table } from "@rangex/rich-text-editor/table";
import { TemplateVariable } from "@rangex/rich-text-editor/template-variable";
import { TodoList } from "@rangex/rich-text-editor/todo-list";
import { UndoRedo } from "@rangex/rich-text-editor/undo-redo";
import { Video } from "@rangex/rich-text-editor/video";
import storedSnapshot from "../DemoData/Demo.json" with { type: "json" };
import {
	codeBlockSettings,
	emptyMediaSettings,
	formattingSettings,
	markdownSettings,
	mentionSettings,
	templateVariableSettings,
} from "../ExtensionSettings";

const licenseKey =
	"eyJ2IjoxLCJraWQiOiJ0ZXN0LTEiLCJjaWQiOiI5NjFiN2FmMS05NTdhLTRiNmMtYjQ2OS0wMjM1MDdkZmQxZDQiLCJ0aWVyIjoiZnJlZSIsImlzc3VlZCI6IjIwMjYtMTAtMDIiLCJleHBpcmVzIjoiMjAyNy0wNC0wMiJ9.j3XyNzZIObuMhOJEBD1C13i1bHtP9-PQ8rUQ1atZQniT8dtEC55GsFB9ENSaX_U92G4l_SlZJOiHB4kzsRWHAw";

const limits: SnapshotLimits = {
	maxDepth: 100,
	maxNodeCount: 50_000,
	maxTextLength: 100_000,
};

export const initRichTextEditor = () => {
	const extensions: Extension[] = [
		AccordionItem({}),
		Audio({}),
		BlockQuote({}),
		Embed({}),
		Emoji({}),
		EmptyMedia(emptyMediaSettings),
		FindReplace({}),
		Formatting(formattingSettings),
		CodeBlock(codeBlockSettings),
		CommandMenu({}),
		Image({}),
		LineHandler({}),
		Link({}),
		List({}),
		Markdown(markdownSettings),
		Mention(mentionSettings),
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

	const snapshot = (() => {
		try {
			const snap = localStorage.getItem("snapshot");

			if (snap) {
				return JSON.parse(snap);
			}
			throw new Error("");
		} catch {
			return storedSnapshot;
		}
	})();

	const richTextEditor = createRichTextEditor({
		licenseKey,
		storedSnapshot: snapshot as StoredSnapshot,
		limits,
		extensions,
	});

	// @ts-expect-error
	window.addSnapshot = () => {
		const snap = richTextEditor.createStoredSnapshot();
		localStorage.setItem("snapshot", JSON.stringify(snap));
	};

	// @ts-expect-error
	window.removeSnapshot = () => {
		localStorage.removeItem("snapshot");
	};

	return richTextEditor;
};
