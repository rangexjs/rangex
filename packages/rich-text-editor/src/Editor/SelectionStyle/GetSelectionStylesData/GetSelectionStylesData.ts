import { createStructuredStyleValue } from "rich-text-area";
import type { FormattingTogglePressed } from "#adapters";
import { assertNever } from "#ports";
import type {
	GetBackgroundColorStylesParams,
	GetBackgroundColorStylesResult,
	GetColorStylesParams,
	GetColorStylesResult,
	GetColorValueFromStructuredColorParams,
	GetColorValueFromStructuredColorResult,
	GetFontFamilyStylesParams,
	GetFontFamilyStylesResult,
	GetFontSizeStylesParams,
	GetFontSizeStylesResult,
	GetInlineTagsParams,
	GetInlineTagsResult,
	GetLetterSpacingStylesParams,
	GetLetterSpacingStylesResult,
	GetLineHeightStylesParams,
	GetLineHeightStylesResult,
	GetPaddingBlockStylesParams,
	GetPaddingBlockStylesResult,
	GetSelectionStylesDataParams,
	GetSelectionStylesDataResult,
	GetStylesParams,
	GetStylesResult,
	GetTextAlignStylesParams,
	GetTextAlignStylesResult,
	GetTextIndentStylesParams,
	GetTextIndentStylesResult,
} from "./GetSelectionStylesData-types";

const getColorValueFromStructuredColor = ({
	color,
}: GetColorValueFromStructuredColorParams): GetColorValueFromStructuredColorResult => {
	if (color.type === "solid") {
		return color.value;
	}

	if (color.type === "linear-gradient") {
		const { deg, colors } = color;

		const colorValues = colors
			.map(({ value, offset }) => `${value} ${offset}%`)
			.join(",");

		return `linear-gradient(${deg}deg, ${colorValues})`;
	}

	return assertNever(color);
};

const getBackgroundColorStyles = ({
	formattingActionState,
}: GetBackgroundColorStylesParams): GetBackgroundColorStylesResult => {
	const { backgroundColor } = formattingActionState;

	if (backgroundColor === undefined) {
		return undefined;
	}

	if (backgroundColor === null) {
		return null;
	}

	const { light, dark } = backgroundColor;

	return createStructuredStyleValue({
		type: "background-color",
		values: { light, dark },
		resolve: ({ light, dark }) => {
			const lightValue = getColorValueFromStructuredColor({
				color: light,
			});

			const darkValue = getColorValueFromStructuredColor({
				color: dark,
			});

			return `light-dark(${lightValue},${darkValue})`;
		},
	});
};

const getColorStyles = ({
	formattingActionState,
}: GetColorStylesParams): GetColorStylesResult => {
	const { color } = formattingActionState;

	if (color === undefined) {
		return undefined;
	}

	if (color === null) {
		return null;
	}

	const { light, dark } = color;

	return createStructuredStyleValue({
		type: "color",
		values: { light, dark },
		resolve: ({ light, dark }) => {
			const lightValue = getColorValueFromStructuredColor({
				color: light,
			});

			const darkValue = getColorValueFromStructuredColor({
				color: dark,
			});

			return `light-dark(${lightValue},${darkValue})`;
		},
	});
};

const getFontFamilyStyles = ({
	formattingActionState,
}: GetFontFamilyStylesParams): GetFontFamilyStylesResult => {
	const { fontFamily } = formattingActionState;

	if (fontFamily === undefined) {
		return undefined;
	}

	if (fontFamily === null) {
		return null;
	}

	return createStructuredStyleValue({
		type: "font-family",
		values: { fontFamily },
		resolve: ({ fontFamily }) => {
			return fontFamily;
		},
	});
};

const getFontSizeStyles = ({
	formattingActionState,
}: GetFontSizeStylesParams): GetFontSizeStylesResult => {
	const { fontSize } = formattingActionState;

	if (fontSize === undefined) {
		return undefined;
	}

	if (fontSize === null) {
		return null;
	}

	return createStructuredStyleValue({
		type: "font-size",
		values: { fontSize },
		resolve: ({ fontSize }) => {
			if (fontSize.type === "px") {
				return `${fontSize.value}px`;
			}

			return assertNever(fontSize.type);
		},
	});
};

const getLetterSpacingStyles = ({
	formattingActionState,
}: GetLetterSpacingStylesParams): GetLetterSpacingStylesResult => {
	const { letterSpacing } = formattingActionState;

	if (letterSpacing === undefined) {
		return undefined;
	}

	if (letterSpacing === null) {
		return null;
	}

	return createStructuredStyleValue({
		type: "letter-spacing",
		values: { letterSpacing },
		resolve: ({ letterSpacing }) => {
			if (letterSpacing.type === "px") {
				return `${letterSpacing.value}px`;
			}

			return assertNever(letterSpacing.type);
		},
	});
};

const getLineHeightStyles = ({
	formattingActionState,
}: GetLineHeightStylesParams): GetLineHeightStylesResult => {
	const { lineHeight } = formattingActionState;

	if (lineHeight === undefined) {
		return undefined;
	}

	return createStructuredStyleValue({
		type: "line-height",
		values: { lineHeight },
		resolve: ({ lineHeight }) => {
			if (lineHeight.type === "number") {
				return `${lineHeight.value}`;
			}

			return assertNever(lineHeight.type);
		},
	});
};

const getPaddingBlockStyles = ({
	formattingActionState,
}: GetPaddingBlockStylesParams): GetPaddingBlockStylesResult => {
	const { lineSpacing } = formattingActionState;

	if (lineSpacing === undefined) {
		return undefined;
	}

	return createStructuredStyleValue({
		type: "padding-block",
		values: { paddingBlock: lineSpacing },
		resolve: ({ paddingBlock }) => {
			if (paddingBlock.type === "px") {
				return `${paddingBlock.value}px`;
			}

			return assertNever(paddingBlock.type);
		},
	});
};

const getTextAlignStyles = ({
	formattingActionState,
}: GetTextAlignStylesParams): GetTextAlignStylesResult => {
	const { textAlign } = formattingActionState;

	if (textAlign === undefined) {
		return undefined;
	}

	return createStructuredStyleValue({
		type: "text-align",
		values: { textAlign },
		resolve: ({ textAlign }) => {
			return textAlign;
		},
	});
};

const getTextIndentStyles = ({
	formattingActionState,
}: GetTextIndentStylesParams): GetTextIndentStylesResult => {
	const { indentation } = formattingActionState;

	if (indentation === undefined) {
		return undefined;
	}

	return createStructuredStyleValue({
		type: "text-indent",
		values: { textIndent: indentation },
		resolve: ({ textIndent }) => {
			if (textIndent.type === "px") {
				return `${textIndent.value}px`;
			}

			return assertNever(textIndent.type);
		},
	});
};

const getStyles = ({
	formattingActionState,
}: GetStylesParams): GetStylesResult => {
	const backgroundColor = getBackgroundColorStyles({ formattingActionState });
	const color = getColorStyles({ formattingActionState });
	const fontFamily = getFontFamilyStyles({ formattingActionState });
	const fontSize = getFontSizeStyles({ formattingActionState });
	const letterSpacing = getLetterSpacingStyles({ formattingActionState });
	const lineHeight = getLineHeightStyles({ formattingActionState });
	const paddingBlock = getPaddingBlockStyles({ formattingActionState });
	const textAlign = getTextAlignStyles({ formattingActionState });
	const textIndent = getTextIndentStyles({ formattingActionState });

	return {
		backgroundColor,
		color,
		fontFamily,
		fontSize,
		textIndent,
		letterSpacing,
		lineHeight,
		paddingBlock,
		textAlign,
	};
};

const getInlineTags = ({
	formattingActionState,
	whenMixed,
}: GetInlineTagsParams): GetInlineTagsResult => {
	const getValue = (pressed: FormattingTogglePressed | undefined) => {
		if (pressed === undefined) {
			return undefined;
		}

		return {
			true: false,
			false: true,
			mixed: { apply: true, remove: false }[whenMixed],
		}[pressed];
	};

	const b = getValue(formattingActionState.bold);
	const code = getValue(formattingActionState.code);
	const i = getValue(formattingActionState.italic);
	const s = getValue(formattingActionState.strikethrough);
	const sub = getValue(formattingActionState.subscript);
	const sup = getValue(formattingActionState.superscript);
	const u = getValue(formattingActionState.underline);

	return { b, code, i, s, sub, sup, u };
};

export const getSelectionStylesData = ({
	formattingActionState,
	whenMixed,
}: GetSelectionStylesDataParams): GetSelectionStylesDataResult => {
	const { lineLocalName } = formattingActionState;

	const inlineTags = getInlineTags({ formattingActionState, whenMixed });

	const styles = getStyles({ formattingActionState });

	return { localName: lineLocalName, inlineTags, styles };
};
