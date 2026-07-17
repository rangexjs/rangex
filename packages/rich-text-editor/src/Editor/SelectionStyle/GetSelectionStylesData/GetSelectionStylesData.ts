import { createStructuredStyleValue } from "rich-text-area";
import type { ToggleButtonPressed } from "#ui";
import { assertNever } from "../../ErrorHandling";
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
	formatStylesActionState,
}: GetBackgroundColorStylesParams): GetBackgroundColorStylesResult => {
	const { backgroundColor } = formatStylesActionState;

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
	formatStylesActionState,
}: GetColorStylesParams): GetColorStylesResult => {
	const { color } = formatStylesActionState;

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
	formatStylesActionState,
}: GetFontFamilyStylesParams): GetFontFamilyStylesResult => {
	const { fontFamily } = formatStylesActionState;

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
	formatStylesActionState,
}: GetFontSizeStylesParams): GetFontSizeStylesResult => {
	const { fontSize } = formatStylesActionState;

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
	formatStylesActionState,
}: GetLetterSpacingStylesParams): GetLetterSpacingStylesResult => {
	const { letterSpacing } = formatStylesActionState;

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
	formatStylesActionState,
}: GetLineHeightStylesParams): GetLineHeightStylesResult => {
	const { lineHeight } = formatStylesActionState;

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
	formatStylesActionState,
}: GetPaddingBlockStylesParams): GetPaddingBlockStylesResult => {
	const { lineSpacing } = formatStylesActionState;

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
	formatStylesActionState,
}: GetTextAlignStylesParams): GetTextAlignStylesResult => {
	const { textAlign } = formatStylesActionState;

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
	formatStylesActionState,
}: GetTextIndentStylesParams): GetTextIndentStylesResult => {
	const { indentation } = formatStylesActionState;

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
	formatStylesActionState,
}: GetStylesParams): GetStylesResult => {
	const backgroundColor = getBackgroundColorStyles({ formatStylesActionState });
	const color = getColorStyles({ formatStylesActionState });
	const fontFamily = getFontFamilyStyles({ formatStylesActionState });
	const fontSize = getFontSizeStyles({ formatStylesActionState });
	const letterSpacing = getLetterSpacingStyles({ formatStylesActionState });
	const lineHeight = getLineHeightStyles({ formatStylesActionState });
	const paddingBlock = getPaddingBlockStyles({ formatStylesActionState });
	const textAlign = getTextAlignStyles({ formatStylesActionState });
	const textIndent = getTextIndentStyles({ formatStylesActionState });

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
	formatStylesActionState,
	whenMixed,
}: GetInlineTagsParams): GetInlineTagsResult => {
	const getValue = (pressed: ToggleButtonPressed | undefined) => {
		if (pressed === undefined) {
			return undefined;
		}

		return {
			true: false,
			false: true,
			mixed: { apply: true, remove: false }[whenMixed],
		}[pressed];
	};

	const b = getValue(formatStylesActionState.bold);
	const code = getValue(formatStylesActionState.code);
	const i = getValue(formatStylesActionState.italic);
	const s = getValue(formatStylesActionState.strikethrough);
	const sub = getValue(formatStylesActionState.subscript);
	const sup = getValue(formatStylesActionState.superscript);
	const u = getValue(formatStylesActionState.underline);

	return { b, code, i, s, sub, sup, u };
};

export const getSelectionStylesData = ({
	formatStylesActionState,
	whenMixed,
}: GetSelectionStylesDataParams): GetSelectionStylesDataResult => {
	const { lineLocalName } = formatStylesActionState;

	const inlineTags = getInlineTags({ formatStylesActionState, whenMixed });

	const styles = getStyles({ formatStylesActionState });

	return { localName: lineLocalName, inlineTags, styles };
};
