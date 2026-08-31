import {
	AccordionItem,
	AccordionItemRx,
	AttributeStyles,
	BlockComponentLine,
	BlockQuote,
	CodeBlock,
	Colors,
	ComponentRx,
	ContentLine,
	Embed,
	EngineGlobalStyles,
	EngineGlobalStylesRx,
	FontStyles,
	GlyphFormatter,
	GlyphFormatterRx,
	Image,
	Link,
	LinkRx,
	List,
	Mention,
	RootEditable,
	RootEditableRx,
	Separator,
	Table,
	TableRx,
	TemplateVariable,
	TodoList,
	Video,
	WidgetElementsRx,
} from "../EngineStyles";
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
		Separator +
		Table +
		TemplateVariable +
		TodoList +
		Video;

	if (!rxStyle) {
		return styleSheetText;
	}

	const rxStyleSheetText =
		AccordionItemRx +
		ComponentRx +
		EngineGlobalStylesRx +
		GlyphFormatterRx +
		LinkRx +
		RootEditableRx +
		TableRx +
		WidgetElementsRx;

	return styleSheetText + rxStyleSheetText;
};
