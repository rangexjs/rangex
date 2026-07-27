import type { FormattingTextAlignValue } from "#adapters";
import type {
	LineHeightStructuredStyleValue,
	PaddingBlockStructuredStyleValue,
	PaddingInlineStructuredStyleValue,
	TextAlignStructuredStyleValue,
	TextIndentStructuredStyleValue,
} from "#editor";
import type { GetDefaultContentLineLocalNamesStylesResult } from "./GetDefaultContentLineLocalNamesStyles-types";

const createDefaultLineHeight = (
	value: number,
): LineHeightStructuredStyleValue => {
	return {
		type: "line-height",
		values: { lineHeight: { type: "number", value } },
		declarationValue: `${value}`,
	};
};

const createDefaultPaddingBlock = (
	value: number,
): PaddingBlockStructuredStyleValue => {
	return {
		type: "padding-block",
		values: { paddingBlock: { type: "px", value } },
		declarationValue: `${value}px`,
	};
};

const createDefaultPaddingInline = (
	value: number,
): PaddingInlineStructuredStyleValue => {
	return {
		type: "padding-inline",
		values: { paddingInline: { type: "px", value } },
		declarationValue: `${value}px`,
	};
};

const createDefaultTextAlign = (
	value: FormattingTextAlignValue,
): TextAlignStructuredStyleValue => {
	return {
		type: "text-align",
		values: { textAlign: value },
		declarationValue: value,
	};
};

const createDefaultTextIndent = (
	value: number,
): TextIndentStructuredStyleValue => {
	return {
		type: "text-indent",
		values: { textIndent: { type: "px", value } },
		declarationValue: `${value}px`,
	};
};

export const getDefaultContentLineLocalNamesStyles =
	(): GetDefaultContentLineLocalNamesStylesResult => {
		return {
			p: {
				lineHeight: createDefaultLineHeight(1.5),
				paddingBlock: createDefaultPaddingBlock(0),
				paddingInline: createDefaultPaddingInline(0),
				textAlign: createDefaultTextAlign("start"),
				textIndent: createDefaultTextIndent(0),
			},
			h1: {
				lineHeight: createDefaultLineHeight(1.2),
				paddingBlock: createDefaultPaddingBlock(0),
				paddingInline: createDefaultPaddingInline(0),
				textAlign: createDefaultTextAlign("start"),
				textIndent: createDefaultTextIndent(0),
			},
			h2: {
				lineHeight: createDefaultLineHeight(1.3),
				paddingBlock: createDefaultPaddingBlock(0),
				paddingInline: createDefaultPaddingInline(0),
				textAlign: createDefaultTextAlign("start"),
				textIndent: createDefaultTextIndent(0),
			},
			h3: {
				lineHeight: createDefaultLineHeight(1.35),
				paddingBlock: createDefaultPaddingBlock(0),
				paddingInline: createDefaultPaddingInline(0),
				textAlign: createDefaultTextAlign("start"),
				textIndent: createDefaultTextIndent(0),
			},
			h4: {
				lineHeight: createDefaultLineHeight(1.4),
				paddingBlock: createDefaultPaddingBlock(0),
				paddingInline: createDefaultPaddingInline(0),
				textAlign: createDefaultTextAlign("start"),
				textIndent: createDefaultTextIndent(0),
			},
			h5: {
				lineHeight: createDefaultLineHeight(1.45),
				paddingBlock: createDefaultPaddingBlock(0),
				paddingInline: createDefaultPaddingInline(0),
				textAlign: createDefaultTextAlign("start"),
				textIndent: createDefaultTextIndent(0),
			},
			h6: {
				lineHeight: createDefaultLineHeight(1.5),
				paddingBlock: createDefaultPaddingBlock(0),
				paddingInline: createDefaultPaddingInline(0),
				textAlign: createDefaultTextAlign("start"),
				textIndent: createDefaultTextIndent(0),
			},
		};
	};
