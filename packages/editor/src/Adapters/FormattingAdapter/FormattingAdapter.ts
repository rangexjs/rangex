import { extendObjectProperties } from "#utilities";
import { createEmitter } from "../_Utilities";
import { defaultFontFamilyOptions } from "./FormattingAdapter-default";
import type {
	CreateFormattingAdapterParams,
	CreateFormattingAdapterResult,
	CreateToggleButtonParams,
	FormattingConfigPort,
	FormattingConfigPortProps,
	FormattingInternals,
	FormattingPublicPort,
	FormattingPublicPortProps,
	FormattingToggleButton,
	OnBackgroundColorUpdateCallbackFn,
	OnBoldUpdateCallbackFn,
	OnCodeUpdateCallbackFn,
	OnColorUpdateCallbackFn,
	OnFontFamilyUpdateCallbackFn,
	OnFontSizeUpdateCallbackFn,
	OnFormattingChangeCallbackFn,
	OnIndentationUpdateCallbackFn,
	OnItalicUpdateCallbackFn,
	OnLetterSpacingUpdateCallbackFn,
	OnLineHeightUpdateCallbackFn,
	OnLineLocalNameUpdateCallbackFn,
	OnLineSpacingUpdateCallbackFn,
	OnRemoveLineUpdateCallbackFn,
	OnRemoveTextUpdateCallbackFn,
	OnStrikethroughUpdateCallbackFn,
	OnSubscriptUpdateCallbackFn,
	OnSuperscriptUpdateCallbackFn,
	OnTextAlignUpdateCallbackFn,
	OnUnderlineUpdateCallbackFn,
	UpdateStateParams,
} from "./FormattingAdapter-types";
import {
	isRemoveLineDisabled,
	isRemoveTextDisabled,
} from "./IsRemoveFormatDisabled";

export const createFormattingAdapter = (
	...params: CreateFormattingAdapterParams
): CreateFormattingAdapterResult => {
	const [
		{
			whenMixed = "apply",
			defaultFontFamily = "Inter",
			defaultFontSize = { type: "px", value: 16 } as const,
			defaultIndentation = { type: "px", value: 0 } as const,
			defaultLineHeight = { type: "number", value: 1.5 } as const,
			defaultLineSpacing = { type: "px", value: 0 } as const,
			defaultTextAlign = "start",
			fontFamilyOptions = defaultFontFamilyOptions,
		},
		_options,
	] = params;

	const createToggleButton = ({
		disabled,
		pressed,
	}: CreateToggleButtonParams): FormattingToggleButton => ({
		disabled,
		pressed,
		get checked() {
			return this.pressed === "true" || this.pressed === "mixed";
		},
	});

	const internals: FormattingInternals = {
		// States
		backgroundColor: { disabled: true, values: new Set() },
		bold: createToggleButton({ disabled: true, pressed: "false" }),
		code: createToggleButton({ disabled: true, pressed: "false" }),
		color: { disabled: true, values: new Set() },
		fontFamily: { disabled: true, values: new Set() },
		fontSize: { disabled: true, values: new Set() },
		indentation: { disabled: true, values: new Set() },
		italic: createToggleButton({ disabled: true, pressed: "false" }),
		letterSpacing: { disabled: true, values: new Set() },
		lineHeight: { disabled: true, values: new Set() },
		lineLocalName: { disabled: true, values: new Set() },
		lineSpacing: { disabled: true, values: new Set() },
		subscript: createToggleButton({ disabled: true, pressed: "false" }),
		superscript: createToggleButton({ disabled: true, pressed: "false" }),
		strikethrough: createToggleButton({ disabled: true, pressed: "false" }),
		textAlign: { disabled: true, values: new Set() },
		underline: createToggleButton({ disabled: true, pressed: "false" }),
		removeLine: { disabled: true },
		removeText: { disabled: true },
		// Rest
		defaultFontFamily,
		defaultFontSize,
		defaultIndentation,
		defaultLineHeight,
		defaultLineSpacing,
		defaultTextAlign,
		fontFamilyOptions,
	};

	// StateListeners
	const backgroundColorUpdateEmitter =
		createEmitter<OnBackgroundColorUpdateCallbackFn>();
	const boldUpdateEmitter = createEmitter<OnBoldUpdateCallbackFn>();
	const codeUpdateEmitter = createEmitter<OnCodeUpdateCallbackFn>();
	const colorUpdateEmitter = createEmitter<OnColorUpdateCallbackFn>();
	const fontFamilyUpdateEmitter = createEmitter<OnFontFamilyUpdateCallbackFn>();
	const fontSizeUpdateEmitter = createEmitter<OnFontSizeUpdateCallbackFn>();
	const indentationUpdateEmitter =
		createEmitter<OnIndentationUpdateCallbackFn>();
	const italicUpdateEmitter = createEmitter<OnItalicUpdateCallbackFn>();
	const letterSpacingUpdateEmitter =
		createEmitter<OnLetterSpacingUpdateCallbackFn>();
	const lineHeightUpdateEmitter = createEmitter<OnLineHeightUpdateCallbackFn>();
	const lineLocalNameUpdateEmitter =
		createEmitter<OnLineLocalNameUpdateCallbackFn>();
	const lineSpacingUpdateEmitter =
		createEmitter<OnLineSpacingUpdateCallbackFn>();
	const subscriptUpdateEmitter = createEmitter<OnSubscriptUpdateCallbackFn>();
	const superscriptUpdateEmitter =
		createEmitter<OnSuperscriptUpdateCallbackFn>();
	const strikethroughUpdateEmitter =
		createEmitter<OnStrikethroughUpdateCallbackFn>();
	const textAlignUpdateEmitter = createEmitter<OnTextAlignUpdateCallbackFn>();
	const underlineUpdateEmitter = createEmitter<OnUnderlineUpdateCallbackFn>();
	const removeLineUpdateEmitter = createEmitter<OnRemoveLineUpdateCallbackFn>();
	const removeTextUpdateEmitter = createEmitter<OnRemoveTextUpdateCallbackFn>();

	// CommandListeners
	const formattingChangeEmitter = createEmitter<OnFormattingChangeCallbackFn>();

	const updateState = ({
		backgroundColor,
		bold,
		code,
		color,
		fontFamily,
		fontSize,
		indentation,
		italic,
		letterSpacing,
		lineHeight,
		lineLocalName,
		lineSpacing,
		subscript,
		superscript,
		strikethrough,
		textAlign,
		underline,
	}: UpdateStateParams) => {
		if (backgroundColor !== undefined) {
			internals.backgroundColor = backgroundColor;

			backgroundColorUpdateEmitter.emit(internals.backgroundColor);
		}

		if (bold !== undefined) {
			internals.bold = createToggleButton(bold);

			boldUpdateEmitter.emit(internals.bold);
		}

		if (code !== undefined) {
			internals.code = createToggleButton(code);

			codeUpdateEmitter.emit(internals.code);
		}

		if (color !== undefined) {
			internals.color = color;

			colorUpdateEmitter.emit(internals.color);
		}

		if (fontFamily !== undefined) {
			internals.fontFamily = fontFamily;

			fontFamilyUpdateEmitter.emit(internals.fontFamily);
		}

		if (fontSize !== undefined) {
			internals.fontSize = fontSize;

			fontSizeUpdateEmitter.emit(internals.fontSize);
		}

		if (indentation !== undefined) {
			internals.indentation = indentation;

			indentationUpdateEmitter.emit(internals.indentation);
		}

		if (italic !== undefined) {
			internals.italic = createToggleButton(italic);

			italicUpdateEmitter.emit(internals.italic);
		}

		if (letterSpacing !== undefined) {
			internals.letterSpacing = letterSpacing;

			letterSpacingUpdateEmitter.emit(internals.letterSpacing);
		}

		if (lineHeight !== undefined) {
			internals.lineHeight = lineHeight;

			lineHeightUpdateEmitter.emit(internals.lineHeight);
		}

		if (lineLocalName !== undefined) {
			internals.lineLocalName = lineLocalName;

			lineLocalNameUpdateEmitter.emit(internals.lineLocalName);
		}

		if (lineSpacing !== undefined) {
			internals.lineSpacing = lineSpacing;

			lineSpacingUpdateEmitter.emit(internals.lineSpacing);
		}

		if (subscript !== undefined) {
			internals.subscript = createToggleButton(subscript);

			subscriptUpdateEmitter.emit(internals.subscript);
		}

		if (superscript !== undefined) {
			internals.superscript = createToggleButton(superscript);

			superscriptUpdateEmitter.emit(internals.superscript);
		}

		if (strikethrough !== undefined) {
			internals.strikethrough = createToggleButton(strikethrough);

			strikethroughUpdateEmitter.emit(internals.strikethrough);
		}

		if (textAlign !== undefined) {
			internals.textAlign = textAlign;

			textAlignUpdateEmitter.emit(internals.textAlign);
		}

		if (underline !== undefined) {
			internals.underline = createToggleButton(underline);

			underlineUpdateEmitter.emit(internals.underline);
		}

		const removeLineDisabled = isRemoveLineDisabled(internals);

		internals.removeLine = { disabled: removeLineDisabled };

		removeLineUpdateEmitter.emit(internals.removeLine);

		const removeTextDisabled = isRemoveTextDisabled(internals);

		internals.removeText = { disabled: removeTextDisabled };

		removeTextUpdateEmitter.emit(internals.removeText);
	};

	const configPort: FormattingConfigPort = extendObjectProperties({}, {
		get whenMixed() {
			return whenMixed;
		},

		updateState(params) {
			updateState(params);
		},

		onFormattingChange(callback) {
			return formattingChangeEmitter.subscribe(callback);
		},
	} satisfies FormattingConfigPortProps);

	const publicPort: FormattingPublicPort = extendObjectProperties({}, {
		get backgroundColor() {
			return internals.backgroundColor;
		},

		get bold() {
			return internals.bold;
		},

		get code() {
			return internals.code;
		},

		get color() {
			return internals.color;
		},

		get fontFamily() {
			return internals.fontFamily;
		},

		get fontSize() {
			return internals.fontSize;
		},

		get indentation() {
			return internals.indentation;
		},

		get italic() {
			return internals.italic;
		},

		get letterSpacing() {
			return internals.letterSpacing;
		},

		get lineHeight() {
			return internals.lineHeight;
		},

		get lineLocalName() {
			return internals.lineLocalName;
		},

		get lineSpacing() {
			return internals.lineSpacing;
		},

		get subscript() {
			return internals.subscript;
		},

		get superscript() {
			return internals.superscript;
		},

		get strikethrough() {
			return internals.strikethrough;
		},

		get textAlign() {
			return internals.textAlign;
		},

		get underline() {
			return internals.underline;
		},

		get removeLine() {
			return internals.removeLine;
		},

		get removeText() {
			return internals.removeText;
		},

		get defaultFontFamily() {
			return internals.defaultFontFamily;
		},

		get defaultFontSize() {
			return internals.defaultFontSize;
		},

		get defaultIndentation() {
			return internals.defaultIndentation;
		},

		get defaultLineHeight() {
			return internals.defaultLineHeight;
		},

		get defaultLineSpacing() {
			return internals.defaultLineSpacing;
		},

		get defaultTextAlign() {
			return internals.defaultTextAlign;
		},

		get fontFamilyOptions() {
			return internals.fontFamilyOptions;
		},

		onBackgroundColorUpdate(callback) {
			return backgroundColorUpdateEmitter.subscribe(callback);
		},

		onBoldUpdate(callback) {
			return boldUpdateEmitter.subscribe(callback);
		},

		onCodeUpdate(callback) {
			return codeUpdateEmitter.subscribe(callback);
		},

		onColorUpdate(callback) {
			return colorUpdateEmitter.subscribe(callback);
		},

		onFontFamilyUpdate(callback) {
			return fontFamilyUpdateEmitter.subscribe(callback);
		},

		onFontSizeUpdate(callback) {
			return fontSizeUpdateEmitter.subscribe(callback);
		},

		onIndentationUpdate(callback) {
			return indentationUpdateEmitter.subscribe(callback);
		},

		onItalicUpdate(callback) {
			return italicUpdateEmitter.subscribe(callback);
		},

		onLetterSpacingUpdate(callback) {
			return letterSpacingUpdateEmitter.subscribe(callback);
		},

		onLineHeightUpdate(callback) {
			return lineHeightUpdateEmitter.subscribe(callback);
		},

		onLineLocalNameUpdate(callback) {
			return lineLocalNameUpdateEmitter.subscribe(callback);
		},

		onLineSpacingUpdate(callback) {
			return lineSpacingUpdateEmitter.subscribe(callback);
		},

		onSubscriptUpdate(callback) {
			return subscriptUpdateEmitter.subscribe(callback);
		},

		onSuperscriptUpdate(callback) {
			return superscriptUpdateEmitter.subscribe(callback);
		},

		onStrikethroughUpdate(callback) {
			return strikethroughUpdateEmitter.subscribe(callback);
		},

		onTextAlignUpdate(callback) {
			return textAlignUpdateEmitter.subscribe(callback);
		},

		onUnderlineUpdate(callback) {
			return underlineUpdateEmitter.subscribe(callback);
		},

		onRemoveLineUpdate(callback) {
			return removeLineUpdateEmitter.subscribe(callback);
		},

		onRemoveTextUpdate(callback) {
			return removeTextUpdateEmitter.subscribe(callback);
		},

		setBackgroundColor(backgroundColor) {
			formattingChangeEmitter.emit({ backgroundColor });
		},

		toggleBold() {
			formattingChangeEmitter.emit({ bold: internals.bold.pressed });
		},

		toggleCode() {
			formattingChangeEmitter.emit({ code: internals.code.pressed });
		},

		setColor(color) {
			formattingChangeEmitter.emit({ color });
		},

		setFontFamily(fontFamily) {
			formattingChangeEmitter.emit({ fontFamily });
		},

		setFontSize(fontSize) {
			formattingChangeEmitter.emit({ fontSize });
		},

		setIndentation(indentation) {
			formattingChangeEmitter.emit({ indentation });
		},

		toggleItalic() {
			formattingChangeEmitter.emit({ italic: internals.italic.pressed });
		},

		setLetterSpacing(letterSpacing) {
			formattingChangeEmitter.emit({ letterSpacing });
		},

		setLineHeight(lineHeight) {
			formattingChangeEmitter.emit({ lineHeight });
		},

		setLineLocalName(lineLocalName) {
			formattingChangeEmitter.emit({ lineLocalName });
		},

		setLineSpacing(lineSpacing) {
			formattingChangeEmitter.emit({ lineSpacing });
		},

		toggleSubscript() {
			formattingChangeEmitter.emit({ subscript: internals.subscript.pressed });
		},

		toggleSuperscript() {
			formattingChangeEmitter.emit({
				superscript: internals.superscript.pressed,
			});
		},

		toggleStrikethrough() {
			formattingChangeEmitter.emit({
				strikethrough: internals.strikethrough.pressed,
			});
		},

		setTextAlign(textAlign) {
			formattingChangeEmitter.emit({ textAlign });
		},

		toggleUnderline() {
			formattingChangeEmitter.emit({ underline: internals.underline.pressed });
		},

		removeLineFormat() {
			formattingChangeEmitter.emit({
				indentation: internals.defaultIndentation,
				lineHeight: internals.defaultLineHeight,
				lineSpacing: internals.defaultLineSpacing,
				textAlign: internals.defaultTextAlign,
			});
		},

		// Each toggle field is sent as "true" — not the value to set, but the
		// currently-applied state the Editor is being told to turn off. Toggle
		// fields in FormattingActionState always mean "this is on, flip it."
		removeTextFormat() {
			formattingChangeEmitter.emit({
				backgroundColor: null,
				bold: "true",
				code: "true",
				color: null,
				fontFamily: null,
				fontSize: null,
				italic: "true",
				letterSpacing: null,
				strikethrough: "true",
				subscript: "true",
				superscript: "true",
				underline: "true",
			});
		},
	} satisfies FormattingPublicPortProps);

	return { configPort, publicPort };
};
