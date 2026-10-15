import type {
	IsRemoveLineDisabledParams,
	IsRemoveTextDisabledParams,
} from "./IsRemoveFormatDisabled-types";

export const isRemoveLineDisabled = (params: IsRemoveLineDisabledParams) => {
	const { indentation, lineHeight, lineSpacing, textAlign } = params;

	const hasIndentation = indentation.values.size > 0;
	const hasLineHeight = lineHeight.values.size > 0;
	const hasLineSpacing = lineSpacing.values.size > 0;
	const hasTextAlign = textAlign.values.size > 0;

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
