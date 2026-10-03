import type {
	FormattingIndentationState,
	FormattingIndentationValue,
	FormattingLineHeightState,
	FormattingLineHeightValue,
	FormattingLineSpacingState,
	FormattingLineSpacingValue,
	FormattingTextAlignState,
	FormattingTextAlignValue,
} from "../FormattingAdapter-types";
import type {
	IsRemoveLineDisabledParams,
	IsRemoveTextDisabledParams,
} from "./IsRemoveFormatDisabled-types";

const checkHasIndentation = (
	indentation: FormattingIndentationState,
	defaultValue: FormattingIndentationValue,
) => {
	if (indentation.values.size > 1) {
		return true;
	}

	const { value } = indentation.values.values().next();

	if (!value) {
		return false;
	}

	return !(
		value.type === defaultValue.type && value.value === defaultValue.value
	);
};

const checkHasLineHeight = (
	lineHeight: FormattingLineHeightState,
	defaultValue: FormattingLineHeightValue,
) => {
	if (lineHeight.values.size > 1) {
		return true;
	}

	const { value } = lineHeight.values.values().next();

	if (!value) {
		return false;
	}

	return !(
		value.type === defaultValue.type && value.value === defaultValue.value
	);
};

const checkHasLineSpacing = (
	lineSpacing: FormattingLineSpacingState,
	defaultValue: FormattingLineSpacingValue,
) => {
	if (lineSpacing.values.size > 1) {
		return true;
	}

	const { value } = lineSpacing.values.values().next();

	if (!value) {
		return false;
	}

	return !(
		value.type === defaultValue.type && value.value === defaultValue.value
	);
};

const checkHasTextAlign = (
	textAlign: FormattingTextAlignState,
	defaultValue: FormattingTextAlignValue,
) => {
	if (textAlign.values.size > 1) {
		return true;
	}

	const { value } = textAlign.values.values().next();

	if (!value) {
		return false;
	}

	return value !== defaultValue;
};

export const isRemoveLineDisabled = (params: IsRemoveLineDisabledParams) => {
	const {
		indentation,
		lineHeight,
		lineSpacing,
		textAlign,
		defaultIndentation,
		defaultLineHeight,
		defaultLineSpacing,
		defaultTextAlign,
	} = params;

	const hasIndentation = checkHasIndentation(indentation, defaultIndentation);
	const hasLineHeight = checkHasLineHeight(lineHeight, defaultLineHeight);
	const hasLineSpacing = checkHasLineSpacing(lineSpacing, defaultLineSpacing);
	const hasTextAlign = checkHasTextAlign(textAlign, defaultTextAlign);

	return !(hasIndentation || hasLineHeight || hasLineSpacing || hasTextAlign);
};

export const isRemoveTextDisabled = (params: IsRemoveTextDisabledParams) => {
	const {
		backgroundColor,
		bold,
		code,
		color,
		fontFamily,
		fontSize,
		italic,
		letterSpacing,
		strikethrough,
		subscript,
		superscript,
		underline,
	} = params;

	const hasBackgroundColor = backgroundColor.values.size > 0;
	const hasBold = bold.pressed !== "false";
	const hasCode = code.pressed !== "false";
	const hasColor = color.values.size > 0;
	const hasFontFamily = fontFamily.values.size > 0;
	const hasFontSize = fontSize.values.size > 0;
	const hasItalic = italic.pressed !== "false";
	const hasLetterSpacing = letterSpacing.values.size > 0;
	const hasStrikethrough = strikethrough.pressed !== "false";
	const hasSubscript = subscript.pressed !== "false";
	const hasSuperscript = superscript.pressed !== "false";
	const hasUnderline = underline.pressed !== "false";

	return !(
		hasBackgroundColor ||
		hasBold ||
		hasCode ||
		hasColor ||
		hasFontFamily ||
		hasFontSize ||
		hasItalic ||
		hasLetterSpacing ||
		hasStrikethrough ||
		hasSubscript ||
		hasSuperscript ||
		hasUnderline
	);
};
