import type { EngineStyles } from "@rangex/editor";
import {
	AttributeStyles,
	Colors,
	EngineGlobalStyles,
	EngineGlobalStylesEditor,
	WidgetElementsEditor,
} from "../Base";
import {
	AccordionItem,
	AccordionItemEditor,
	BlockQuote,
	CodeBlock,
	ComponentEditor,
	Embed,
	Image,
	Link,
	LinkEditor,
	List,
	Mention,
	Separator,
	Table,
	TableEditor,
	TemplateVariable,
	TodoList,
	Video,
} from "../Components";
import {
	ContentLine,
	GlyphFormatterEditor,
	GlyphFormatterRendered,
	RootEditable,
	RootEditableEditor,
} from "../EditorElements";

export const getEngineStyles = (): EngineStyles => {
	const baseCommon = AttributeStyles + Colors + EngineGlobalStyles;
	const baseEditor = EngineGlobalStylesEditor + WidgetElementsEditor;

	const componentsCommon =
		AccordionItem +
		BlockQuote +
		CodeBlock +
		Embed +
		Image +
		Link +
		List +
		Mention +
		Separator +
		Table +
		TemplateVariable +
		TodoList +
		Video;
	const componentsEditor =
		AccordionItemEditor + ComponentEditor + LinkEditor + TableEditor;

	const editorElementsCommon = ContentLine + RootEditable;
	const editorElementsEditor = GlyphFormatterEditor + RootEditableEditor;
	const editorElementsRendered = GlyphFormatterRendered;

	const common = baseCommon + componentsCommon + editorElementsCommon;

	const editor = baseEditor + componentsEditor + editorElementsEditor;

	const rendered = editorElementsRendered;

	return { common, editor, rendered };
};
