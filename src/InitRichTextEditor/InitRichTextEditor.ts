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
	markdownSettings,
	mentionSettings,
	templateVariableSettings,
} from "../ExtensionSettings";

export const initRichTextEditor = () => {
	const extensions: Extension[] = [
		AccordionItem({}),
		Audio({}),
		BlockQuote({}),
		Embed({}),
		Emoji({}),
		EmptyMedia(emptyMediaSettings),
		FindReplace({}),
		Formatting({}),
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

	const richTextEditor = createRichTextEditor({
		storedSnapshot: storedSnapshot as StoredSnapshot,
		extensions,
	});

	return richTextEditor;
};
