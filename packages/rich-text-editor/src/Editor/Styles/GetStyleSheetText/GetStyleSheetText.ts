import {
	AccordionItem,
	AccordionItemRx,
	AttributeStyles,
	BlockComponentLine,
	BlockQuote,
	CodeBlock,
	Colors,
	ContentLine,
	Embed,
	EngineGlobalStyles,
	FontStyles,
	GlyphFormatter,
	Image,
	Link,
	List,
	Mention,
	Table,
	TemplateVariable,
	TodoList,
	Video,
} from "../EngineStyles";
// Temporary
import CaretAnchorRx from "../InteractiveStyles/CaretAnchor.css?inline";
import InteractiveStyles from "../InteractiveStyles.css?inline";
import type { GetStyleSheetTextParams } from "./GetStyleSheetText-types";

export const getStyleSheetText = ({ rxStyle }: GetStyleSheetTextParams) => {
	const baseText = AttributeStyles + Colors + FontStyles + EngineGlobalStyles;

	const componentText =
		AccordionItem +
		BlockQuote +
		CodeBlock +
		Embed +
		Image +
		Link +
		List +
		Mention +
		Table +
		TemplateVariable +
		TodoList +
		Video;

	const editorElementText = BlockComponentLine + ContentLine + GlyphFormatter;

	const styleSheetText = baseText + componentText + editorElementText;

	if (!rxStyle) {
		return styleSheetText;
	}

	const rxStyleSheetText = AccordionItemRx + CaretAnchorRx + InteractiveStyles;

	return styleSheetText + rxStyleSheetText;
};
