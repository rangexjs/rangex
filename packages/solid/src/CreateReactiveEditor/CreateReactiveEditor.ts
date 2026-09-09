import {
	AccordionItem,
	Audio,
	CodeBlock,
	Embed,
	Emoji,
	EmptyMedia,
	Formatting,
	Image,
	Mention,
	ReadOnly,
	Separator,
	TemplateVariable,
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

	if (editor.codeBlock) {
		const { port, dispose } = CodeBlock(editor.codeBlock);

		reactiveEditor.codeBlock = port;
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

	if (editor.templateVariable) {
		const { port, dispose } = TemplateVariable(editor.templateVariable);

		reactiveEditor.templateVariable = port;
		disposeList.add(dispose);
	}

	if (editor.video) {
		const { port, dispose } = Video(editor.video);

		reactiveEditor.video = port;
		disposeList.add(dispose);
	}

	return { reactiveEditor, disposeList };
};
