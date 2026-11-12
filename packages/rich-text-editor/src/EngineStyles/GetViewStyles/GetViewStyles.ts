import { Colors, EngineGlobalStyles } from "../Base";
import {
	AccordionItem,
	Audio,
	BlockQuote,
	CodeBlock,
	Embed,
	Image,
	Link,
	List,
	Mention,
	Separator,
	Table,
	TemplateVariable,
	TodoList,
	Video,
} from "../Components";
import { ContentLine, GlyphFormatterView, RootEditable } from "../EditorElements";

/*
 * Builds the style text for rendered snapshot output: shared component/base styles plus the view-only styles.
 */
export const getViewStyles = () => {
	const baseCommon = Colors + EngineGlobalStyles;

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

	const editorElementsCommon = ContentLine + RootEditable;

	const common = baseCommon + componentsCommon + editorElementsCommon;

	return common + GlyphFormatterView;
};
