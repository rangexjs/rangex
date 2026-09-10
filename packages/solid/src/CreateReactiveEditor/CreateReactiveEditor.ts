import {
	AccordionItem,
	Audio,
	BlockQuote,
	CodeBlock,
	CommandMenu,
	Embed,
	Emoji,
	EmptyMedia,
	FindReplace,
	Formatting,
	Image,
	List,
	Mention,
	ReadOnly,
	Separator,
	Symbols,
	TemplateVariable,
	TodoList,
	UndoRedo,
	Video,
} from "../ReactivePorts";
import type {
	CreateReactiveEditorParams,
	CreateReactiveEditorResult,
	ReactiveEditor,
} from "./CreateReactiveEditor-types";

export const createReactiveEditor = ({
	editor,
}: CreateReactiveEditorParams): CreateReactiveEditorResult => {
	const reactiveEditor: ReactiveEditor = {};
	const disposeList = new Set<() => void>();

	if (editor.accordionItem) {
		const { port, dispose } = AccordionItem(editor.accordionItem);

		reactiveEditor.accordionItem = port;
		disposeList.add(dispose);
	}

	if (editor.audio) {
		const { port, dispose } = Audio(editor.audio);

		reactiveEditor.audio = port;
		disposeList.add(dispose);
	}

	if (editor.blockQuote) {
		const { port, dispose } = BlockQuote(editor.blockQuote);

		reactiveEditor.blockQuote = port;
		disposeList.add(dispose);
	}

	if (editor.codeBlock) {
		const { port, dispose } = CodeBlock(editor.codeBlock);

		reactiveEditor.codeBlock = port;
		disposeList.add(dispose);
	}

	if (editor.commandMenu) {
		const { port, dispose } = CommandMenu(editor.commandMenu);

		reactiveEditor.commandMenu = port;
		disposeList.add(dispose);
	}

	if (editor.embed) {
		const { port, dispose } = Embed(editor.embed);

		reactiveEditor.embed = port;
		disposeList.add(dispose);
	}

	if (editor.emoji) {
		const { port, dispose } = Emoji(editor.emoji);

		reactiveEditor.emoji = port;
		disposeList.add(dispose);
	}

	if (editor.emptyMedia) {
		const { port, dispose } = EmptyMedia(editor.emptyMedia);

		reactiveEditor.emptyMedia = port;
		disposeList.add(dispose);
	}

	if (editor.findReplace) {
		const { port, dispose } = FindReplace(editor.findReplace);

		reactiveEditor.findReplace = port;
		disposeList.add(dispose);
	}

	if (editor.formatting) {
		const { port, dispose } = Formatting(editor.formatting);

		reactiveEditor.formatting = port;
		disposeList.add(dispose);
	}

	if (editor.image) {
		const { port, dispose } = Image(editor.image);

		reactiveEditor.image = port;
		disposeList.add(dispose);
	}

	if (editor.list) {
		const { port, dispose } = List(editor.list);

		reactiveEditor.list = port;
		disposeList.add(dispose);
	}

	if (editor.mention) {
		const { port, dispose } = Mention(editor.mention);

		reactiveEditor.mention = port;
		disposeList.add(dispose);
	}

	if (editor.readOnly) {
		const { port, dispose } = ReadOnly(editor.readOnly);

		reactiveEditor.readOnly = port;
		disposeList.add(dispose);
	}

	if (editor.separator) {
		const { port, dispose } = Separator(editor.separator);

		reactiveEditor.separator = port;
		disposeList.add(dispose);
	}

	if (editor.symbols) {
		const { port, dispose } = Symbols(editor.symbols);

		reactiveEditor.symbols = port;
		disposeList.add(dispose);
	}

	if (editor.templateVariable) {
		const { port, dispose } = TemplateVariable(editor.templateVariable);

		reactiveEditor.templateVariable = port;
		disposeList.add(dispose);
	}

	if (editor.todoList) {
		const { port, dispose } = TodoList(editor.todoList);

		reactiveEditor.todoList = port;
		disposeList.add(dispose);
	}

	if (editor.undoRedo) {
		const { port, dispose } = UndoRedo(editor.undoRedo);

		reactiveEditor.undoRedo = port;
		disposeList.add(dispose);
	}

	if (editor.video) {
		const { port, dispose } = Video(editor.video);

		reactiveEditor.video = port;
		disposeList.add(dispose);
	}

	return { reactiveEditor, disposeList };
};
