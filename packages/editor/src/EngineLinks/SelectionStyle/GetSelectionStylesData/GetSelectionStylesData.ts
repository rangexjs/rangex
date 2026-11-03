import type { FormattingTogglePressed } from "#adapters/Formatting";
import {
	createBackgroundColorStructuredStyle,
	createColorStructuredStyle,
	createFontFamilyStructuredStyle,
	createFontSizeStructuredStyle,
	createLetterSpacingStructuredStyle,
	createLineHeightStructuredStyle,
	createPaddingBlockStructuredStyle,
	createTextAlignStructuredStyle,
	createTextIndentStructuredStyle,
} from "#structured-style";
import type {
	GetBackgroundColorStylesParams,
	GetBackgroundColorStylesResult,
	GetColorStylesParams,
	GetColorStylesResult,
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

	return createBackgroundColorStructuredStyle({ backgroundColor });
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

	return createColorStructuredStyle({ color });
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

	return createFontFamilyStructuredStyle({ fontFamily });
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

	return createFontSizeStructuredStyle({ fontSize });
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

	return createLetterSpacingStructuredStyle({ letterSpacing });
};

const getLineHeightStyles = ({
	formattingActionState,
}: GetLineHeightStylesParams): GetLineHeightStylesResult => {
	const { lineHeight } = formattingActionState;

	if (lineHeight === undefined) {
		return undefined;
	}

	if (lineHeight === null) {
		return null;
	}

	return createLineHeightStructuredStyle({ lineHeight });
};

const getPaddingBlockStyles = ({
	formattingActionState,
}: GetPaddingBlockStylesParams): GetPaddingBlockStylesResult => {
	const { lineSpacing } = formattingActionState;

	if (lineSpacing === undefined) {
		return undefined;
	}

	if (lineSpacing === null) {
		return null;
	}

	return createPaddingBlockStructuredStyle({ paddingBlock: lineSpacing });
};

const getTextAlignStyles = ({
	formattingActionState,
}: GetTextAlignStylesParams): GetTextAlignStylesResult => {
	const { textAlign } = formattingActionState;

	if (textAlign === undefined) {
		return undefined;
	}

	if (textAlign === null) {
		return null;
	}

	return createTextAlignStructuredStyle({ textAlign });
};

const getTextIndentStyles = ({
	formattingActionState,
}: GetTextIndentStylesParams): GetTextIndentStylesResult => {
	const { indentation } = formattingActionState;

	if (indentation === undefined) {
		return undefined;
	}

	if (indentation === null) {
		return null;
	}

	return createTextIndentStructuredStyle({ textIndent: indentation });
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
