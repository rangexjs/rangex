import {
	AttributeStyles,
	Colors,
	EngineGlobalStyles,
	EngineGlobalStylesRx,
	FontStyles,
	WidgetElementsRx,
} from "../Base";
import {
	AccordionItem,
	AccordionItemRx,
	BlockQuote,
	CodeBlock,
	ComponentRx,
	Embed,
	Image,
	Link,
	LinkRx,
	List,
	Mention,
	Separator,
	Table,
	TableRx,
	TemplateVariable,
	TodoList,
	Video,
} from "../Components";
import {
	BlockComponentLine,
	ContentLine,
	GlyphFormatter,
	GlyphFormatterRx,
	RootEditable,
	RootEditableRx,
} from "../EditorElements";
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
