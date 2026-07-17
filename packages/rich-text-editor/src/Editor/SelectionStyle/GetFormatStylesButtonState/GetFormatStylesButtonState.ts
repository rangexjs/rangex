import type {
	BackgroundColorValue,
	ColorValue,
	FontFamilyValue,
	FontSizeValue,
	LetterSpacingValue,
} from "#ui";
import {
	isValidBackgroundColorStructuredStyle,
	isValidColorStructuredStyle,
	isValidFontFamilyStructuredStyle,
	isValidFontSizeStructuredStyle,
	isValidLetterSpacingStructuredStyle,
	isValidLineHeightStructuredStyle,
	isValidPaddingBlockStructuredStyle,
	isValidTextAlignStructuredStyle,
	isValidTextIndentStructuredStyle,
} from "../StructuredStyleValue";
import type {
	GetBackgroundColorToolbarButtonStateParams,
	GetBackgroundColorToolbarButtonStateResult,
	GetColorToolbarButtonStateParams,
	GetColorToolbarButtonStateResult,
	GetFontFamilyToolbarButtonStateParams,
	GetFontFamilyToolbarButtonStateResult,
	GetFontSizeToolbarButtonStateParams,
	GetFontSizeToolbarButtonStateResult,
	GetFormatStylesButtonStateParams,
	GetformatStylesButtonStateResult,
	GetIndentationToolbarButtonStateParams,
	GetIndentationToolbarButtonStateResult,
	GetLetterSpacingToolbarButtonStateParams,
	GetLetterSpacingToolbarButtonStateResult,
	GetLineHeightToolbarButtonStateParams,
	GetLineHeightToolbarButtonStateResult,
	GetLineLocalNameParams,
	GetLineLocalNameResult,
	GetLineSpacingToolbarButtonStateParams,
	GetLineSpacingToolbarButtonStateResult,
	GetTextAlignToolbarButtonStateParams,
	GetTextAlignToolbarButtonStateResult,
	GetToggleButtonStateParams,
	GetToggleButtonStateResult,
	InitializeToggleButtonStateGetterParams,
	InitializeToggleButtonStateGetterResult,
} from "./GetFormatStylesButtonState-types";

const getLineLocalName = ({
	contentLineLocalNames,
}: GetLineLocalNameParams): GetLineLocalNameResult => {
	const { permission, values } = contentLineLocalNames;

	const disabled = permission === "not-allowed";

	const lineLocalNameValues = new Set(values);

	return { disabled, values: lineLocalNameValues };
};

const initializeToggleButtonStateGetter = ({
	glyphFormatterInlineTags,
	textFormatInlineTagsState,
}: InitializeToggleButtonStateGetterParams): InitializeToggleButtonStateGetterResult => {
	const getToggleButtonState = ({
		inlineTagKey,
		inlineTagStateKey,
	}: GetToggleButtonStateParams): GetToggleButtonStateResult => {
		const stateValue = textFormatInlineTagsState[inlineTagStateKey];

		if (stateValue !== undefined) {
			return { disabled: false, pressed: `${stateValue}` };
		}

		const value = glyphFormatterInlineTags[inlineTagKey];

		const disabled = value.permission === "not-allowed";
		const pressed = (
			{ applied: "true", "not-applied": "false", mixed: "mixed" } as const
		)[value.state];

		return { disabled, pressed };
	};

	return getToggleButtonState;
};

const getLineHeightToolbarButtonState = ({
	contentLineStructuredStyle,
}: GetLineHeightToolbarButtonStateParams): GetLineHeightToolbarButtonStateResult => {
	const { lineHeight } = contentLineStructuredStyle;

	const { style, permission } = lineHeight;

	if (permission === "not-allowed") {
		return { disabled: true, values: new Set() };
	}

	if (style.state === "not-applied") {
		return { disabled: false, values: new Set() };
	}

	const validStructuredStyles = style.values.filter(
		isValidLineHeightStructuredStyle,
	);

	const values = new Set(
		validStructuredStyles.map(
			(structuredStyle) => structuredStyle.values.lineHeight,
		),
	);

	return { disabled: false, values };
};

const getLineSpacingToolbarButtonState = ({
	contentLineStructuredStyle,
}: GetLineSpacingToolbarButtonStateParams): GetLineSpacingToolbarButtonStateResult => {
	const { paddingBlock } = contentLineStructuredStyle;

	const { style, permission } = paddingBlock;

	if (permission === "not-allowed") {
		return { disabled: true, values: new Set() };
	}

	if (style.state === "not-applied") {
		return { disabled: false, values: new Set() };
	}

	const validStructuredStyles = style.values.filter(
		isValidPaddingBlockStructuredStyle,
	);

	const values = new Set(
		validStructuredStyles.map(
			(structuredStyle) => structuredStyle.values.paddingBlock,
		),
	);

	return { disabled: false, values };
};

const getIndentationToolbarButtonState = ({
	contentLineStructuredStyle,
}: GetIndentationToolbarButtonStateParams): GetIndentationToolbarButtonStateResult => {
	const { textIndent } = contentLineStructuredStyle;

	const { style, permission } = textIndent;

	if (permission === "not-allowed") {
		return { disabled: true, values: new Set() };
	}

	if (style.state === "not-applied") {
		return { disabled: false, values: new Set() };
	}

	const validStructuredStyles = style.values.filter(
		isValidTextIndentStructuredStyle,
	);

	const values = new Set(
		validStructuredStyles.map(
			(structuredStyle) => structuredStyle.values.textIndent,
		),
	);

	return { disabled: false, values };
};

const getTextAlignToolbarButtonState = ({
	contentLineStructuredStyle,
}: GetTextAlignToolbarButtonStateParams): GetTextAlignToolbarButtonStateResult => {
	const { textAlign } = contentLineStructuredStyle;

	const { style, permission } = textAlign;

	if (permission === "not-allowed") {
		return { disabled: true, values: new Set() };
	}

	if (style.state === "not-applied") {
		return { disabled: false, values: new Set() };
	}

	const validStructuredStyles = style.values.filter(
		isValidTextAlignStructuredStyle,
	);

	const values = new Set(
		validStructuredStyles.map(
			(structuredStyle) => structuredStyle.values.textAlign,
		),
	);

	return { disabled: false, values };
};

const getBackgroundColorToolbarButtonState = ({
	glyphFormatterStructuredStyle,
	textFormatStylesState,
}: GetBackgroundColorToolbarButtonStateParams): GetBackgroundColorToolbarButtonStateResult => {
	if (textFormatStylesState.backgroundColor) {
		const { backgroundColor } = textFormatStylesState;

		if (!isValidBackgroundColorStructuredStyle(backgroundColor)) {
			return { disabled: true, values: new Set() };
		}

		const values = new Set<BackgroundColorValue>([backgroundColor.values]);

		return { disabled: false, values };
	}

	const { backgroundColor } = glyphFormatterStructuredStyle;

	const { style, permission } = backgroundColor;

	if (permission === "not-allowed") {
		return { disabled: true, values: new Set() };
	}

	if (style.state === "not-applied") {
		return { disabled: false, values: new Set() };
	}

	const validStructuredStyles = style.values.filter(
		isValidBackgroundColorStructuredStyle,
	);

	const values = new Set(
		validStructuredStyles.map((structuredStyle) => structuredStyle.values),
	);

	return { disabled: false, values };
};

const getColorToolbarButtonState = ({
	glyphFormatterStructuredStyle,
	textFormatStylesState,
}: GetColorToolbarButtonStateParams): GetColorToolbarButtonStateResult => {
	if (textFormatStylesState.color) {
		const { color } = textFormatStylesState;

		if (!isValidColorStructuredStyle(color)) {
			return { disabled: true, values: new Set() };
		}

		const values = new Set<ColorValue>([color.values]);

		return { disabled: false, values };
	}

	const { color } = glyphFormatterStructuredStyle;

	const { style, permission } = color;

	if (permission === "not-allowed") {
		return { disabled: true, values: new Set() };
	}

	if (style.state === "not-applied") {
		return { disabled: false, values: new Set() };
	}

	const validStructuredStyles = style.values.filter(
		isValidColorStructuredStyle,
	);

	const values = new Set(
		validStructuredStyles.map((structuredStyle) => structuredStyle.values),
	);

	return { disabled: false, values };
};

const getFontFamilyToolbarButtonState = ({
	glyphFormatterStructuredStyle,
	textFormatStylesState,
}: GetFontFamilyToolbarButtonStateParams): GetFontFamilyToolbarButtonStateResult => {
	if (textFormatStylesState.fontFamily) {
		const { fontFamily } = textFormatStylesState;

		if (!isValidFontFamilyStructuredStyle(fontFamily)) {
			return { disabled: true, values: new Set() };
		}

		const values = new Set<FontFamilyValue>([fontFamily.values.fontFamily]);

		return { disabled: false, values };
	}

	const { fontFamily } = glyphFormatterStructuredStyle;

	const { style, permission } = fontFamily;

	if (permission === "not-allowed") {
		return { disabled: true, values: new Set() };
	}

	if (style.state === "not-applied") {
		return { disabled: false, values: new Set() };
	}

	const validStructuredStyles = style.values.filter(
		isValidFontFamilyStructuredStyle,
	);

	const values = new Set(
		validStructuredStyles.map(
			(structuredStyle) => structuredStyle.values.fontFamily,
		),
	);

	return { disabled: false, values };
};

const getFontSizeToolbarButtonState = ({
	glyphFormatterStructuredStyle,
	textFormatStylesState,
}: GetFontSizeToolbarButtonStateParams): GetFontSizeToolbarButtonStateResult => {
	if (textFormatStylesState.fontSize) {
		const { fontSize } = textFormatStylesState;

		if (!isValidFontSizeStructuredStyle(fontSize)) {
			return { disabled: true, values: new Set() };
		}

		const values = new Set<FontSizeValue>([fontSize.values.fontSize]);

		return { disabled: false, values };
	}

	const { fontSize } = glyphFormatterStructuredStyle;

	const { style, permission } = fontSize;

	if (permission === "not-allowed") {
		return { disabled: true, values: new Set() };
	}

	if (style.state === "not-applied") {
		return { disabled: false, values: new Set() };
	}

	const validStructuredStyles = style.values.filter(
		isValidFontSizeStructuredStyle,
	);

	const values = new Set(
		validStructuredStyles.map(
			(structuredStyle) => structuredStyle.values.fontSize,
		),
	);

	return { disabled: false, values };
};

const getLetterSpacingToolbarButtonState = ({
	glyphFormatterStructuredStyle,
	textFormatStylesState,
}: GetLetterSpacingToolbarButtonStateParams): GetLetterSpacingToolbarButtonStateResult => {
	if (textFormatStylesState.letterSpacing) {
		const { letterSpacing } = textFormatStylesState;

		if (!isValidLetterSpacingStructuredStyle(letterSpacing)) {
			return { disabled: true, values: new Set() };
		}

		const values = new Set<LetterSpacingValue>([
			letterSpacing.values.letterSpacing,
		]);

		return { disabled: false, values };
	}

	const { letterSpacing } = glyphFormatterStructuredStyle;

	const { style, permission } = letterSpacing;

	if (permission === "not-allowed") {
		return { disabled: true, values: new Set() };
	}

	if (style.state === "not-applied") {
		return { disabled: false, values: new Set() };
	}

	const validStructuredStyles = style.values.filter(
		isValidLetterSpacingStructuredStyle,
	);

	const values = new Set(
		validStructuredStyles.map(
			(structuredStyle) => structuredStyle.values.letterSpacing,
		),
	);

	return { disabled: false, values };
};

export const getFormatStylesButtonState = ({
	selectionFormatStyles,
}: GetFormatStylesButtonStateParams): GetformatStylesButtonStateResult => {
	const {
		contentLineLocalNames,
		contentLineStructuredStyle,
		glyphFormatterInlineTags,
		glyphFormatterStructuredStyle,
		textFormatInlineTagsState,
		textFormatStylesState,
	} = selectionFormatStyles;

	const lineLocalName = getLineLocalName({ contentLineLocalNames });

	const getToggleButtonState = initializeToggleButtonStateGetter({
		glyphFormatterInlineTags,
		textFormatInlineTagsState,
	});

	const bold = getToggleButtonState({
		inlineTagKey: "b",
		inlineTagStateKey: "b",
	});
	const code = getToggleButtonState({
		inlineTagKey: "code",
		inlineTagStateKey: "code",
	});
	const italic = getToggleButtonState({
		inlineTagKey: "i",
		inlineTagStateKey: "i",
	});
	const strikethrough = getToggleButtonState({
		inlineTagKey: "s",
		inlineTagStateKey: "s",
	});
	const subscript = getToggleButtonState({
		inlineTagKey: "sub",
		inlineTagStateKey: "sub",
	});
	const superscript = getToggleButtonState({
		inlineTagKey: "sup",
		inlineTagStateKey: "sup",
	});
	const underline = getToggleButtonState({
		inlineTagKey: "u",
		inlineTagStateKey: "u",
	});

	const lineHeight = getLineHeightToolbarButtonState({
		contentLineStructuredStyle,
	});
	const lineSpacing = getLineSpacingToolbarButtonState({
		contentLineStructuredStyle,
	});
	const indentation = getIndentationToolbarButtonState({
		contentLineStructuredStyle,
	});
	const textAlign = getTextAlignToolbarButtonState({
		contentLineStructuredStyle,
	});

	const backgroundColor = getBackgroundColorToolbarButtonState({
		glyphFormatterStructuredStyle,
		textFormatStylesState,
	});
	const color = getColorToolbarButtonState({
		glyphFormatterStructuredStyle,
		textFormatStylesState,
	});
	const fontFamily = getFontFamilyToolbarButtonState({
		glyphFormatterStructuredStyle,
		textFormatStylesState,
	});
	const fontSize = getFontSizeToolbarButtonState({
		glyphFormatterStructuredStyle,
		textFormatStylesState,
	});
	const letterSpacing = getLetterSpacingToolbarButtonState({
		glyphFormatterStructuredStyle,
		textFormatStylesState,
	});

	return {
		lineLocalName,
		bold,
		code,
		italic,
		strikethrough,
		subscript,
		superscript,
		underline,
		lineHeight,
		lineSpacing,
		indentation,
		textAlign,
		backgroundColor,
		color,
		fontFamily,
		fontSize,
		letterSpacing,
	};
};
