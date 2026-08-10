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
	InternalElementsRx,
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
		InternalElementsRx +
		LinkRx +
		RootEditableRx +
		TableRx;

	return styleSheetText + rxStyleSheetText;
};
