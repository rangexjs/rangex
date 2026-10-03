import type { StructuredStyleValue } from "@rangex/core";
import type {
	BackgroundColorStructuredStyleValue,
	ColorStructuredStyleValue,
	FontFamilyStructuredStyleValue,
	FontSizeStructuredStyleValue,
	LetterSpacingStructuredStyleValue,
	LineHeightStructuredStyleValue,
	PaddingBlockStructuredStyleValue,
	PaddingInlineStructuredStyleValue,
	StructuredStyleValueType,
	TextAlignStructuredStyleValue,
	TextIndentStructuredStyleValue,
} from "./StructuredStyleValue-types";

const isStructuredStyleOfType = (
	value: StructuredStyleValue,
	type: StructuredStyleValueType,
) => {
	if (value.type === type) {
		return true;
	}

	console.warn("Unknown structured style value was found.", value);
	return false;
};

export const isValidBackgroundColorStructuredStyle = (
	value: StructuredStyleValue,
): value is BackgroundColorStructuredStyleValue => {
	return isStructuredStyleOfType(value, "background-color");
};

export const isValidColorStructuredStyle = (
	value: StructuredStyleValue,
): value is ColorStructuredStyleValue => {
	return isStructuredStyleOfType(value, "color");
};

export const isValidFontFamilyStructuredStyle = (
	value: StructuredStyleValue,
): value is FontFamilyStructuredStyleValue => {
	return isStructuredStyleOfType(value, "font-family");
};

export const isValidFontSizeStructuredStyle = (
	value: StructuredStyleValue,
): value is FontSizeStructuredStyleValue => {
	return isStructuredStyleOfType(value, "font-size");
};

export const isValidLetterSpacingStructuredStyle = (
	value: StructuredStyleValue,
): value is LetterSpacingStructuredStyleValue => {
	return isStructuredStyleOfType(value, "letter-spacing");
};

export const isValidLineHeightStructuredStyle = (
	value: StructuredStyleValue,
): value is LineHeightStructuredStyleValue => {
	return isStructuredStyleOfType(value, "line-height");
};

export const isValidPaddingBlockStructuredStyle = (
	value: StructuredStyleValue,
): value is PaddingBlockStructuredStyleValue => {
	return isStructuredStyleOfType(value, "padding-block");
};

export const isValidPaddingInlineStructuredStyle = (
	value: StructuredStyleValue,
): value is PaddingInlineStructuredStyleValue => {
	return isStructuredStyleOfType(value, "padding-inline");
};

export const isValidTextAlignStructuredStyle = (
	value: StructuredStyleValue,
): value is TextAlignStructuredStyleValue => {
	return isStructuredStyleOfType(value, "text-align");
};

export const isValidTextIndentStructuredStyle = (
	value: StructuredStyleValue,
): value is TextIndentStructuredStyleValue => {
	return isStructuredStyleOfType(value, "text-indent");
};
