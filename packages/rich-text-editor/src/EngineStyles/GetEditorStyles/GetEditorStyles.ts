import {
	Colors,
	EngineGlobalStyles,
	EngineGlobalStylesEditor,
	WidgetElementsEditor,
} from "../Base";
import {
	AccordionItem,
	AccordionItemEditor,
	Audio,
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
	RootEditable,
	RootEditableEditor,
} from "../EditorElements";

/*
 * Builds the custom style text for the live editor: shared component/base styles plus the editor-only styles.
 */
export const getEditorStyles = () => {
	const baseCommon = Colors + EngineGlobalStyles;
	const baseEditor = EngineGlobalStylesEditor + WidgetElementsEditor;

	const componentsCommon =
		AccordionItem +
		Audio +
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
	const componentsEditor = AccordionItemEditor + ComponentEditor + LinkEditor + TableEditor;

	const editorElementsCommon = ContentLine + RootEditable;
	const editorElementsEditor = GlyphFormatterEditor + RootEditableEditor;

	const common = baseCommon + componentsCommon + editorElementsCommon;
	const editor = baseEditor + componentsEditor + editorElementsEditor;

	return common + editor;
};
