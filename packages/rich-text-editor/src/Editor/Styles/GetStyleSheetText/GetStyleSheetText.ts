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
	EngineGlobalStylesRx,
	FontStyles,
	GlyphFormatter,
	GlyphFormatterRx,
	Image,
	InternalElementsRx,
	Link,
	List,
	Mention,
	RootEditable,
	RootEditableRx,
	Table,
	TemplateVariable,
	TodoList,
	Video,
} from "../EngineStyles";
// Temporary
import InteractiveStyles from "../InteractiveStyles.css?inline";
import type { GetStyleSheetTextParams } from "./GetStyleSheetText-types";

export const getStyleSheetText = ({ rxStyle }: GetStyleSheetTextParams) => {
	const styleSheetText =
		AccordionItem +
		AttributeStyles +
		BlockComponentLine +
		BlockQuote +
		CodeBlock +
		Colors +
		ContentLine +
		Embed +
		EngineGlobalStyles +
		FontStyles +
		GlyphFormatter +
		Image +
		Link +
		List +
		Mention +
		RootEditable +
		Table +
		TemplateVariable +
		TodoList +
		Video;

	if (!rxStyle) {
		return styleSheetText;
	}

	const rxStyleSheetText =
		AccordionItemRx +
		EngineGlobalStylesRx +
		GlyphFormatterRx +
		InternalElementsRx +
		RootEditableRx;

	return styleSheetText + rxStyleSheetText + InteractiveStyles;
};
