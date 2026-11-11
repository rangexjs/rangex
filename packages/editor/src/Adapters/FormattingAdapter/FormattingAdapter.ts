import { extendObjectProperties } from "#utilities";

import { createEmitter, createStateEmitter } from "../_Utilities";
import type {
	CreateFormattingAdapterParams,
	CreateFormattingAdapterResult,
	CreateToggleButtonParams,
	FormattingBackgroundColorState,
	FormattingBoldState,
	FormattingCodeState,
	FormattingColorState,
	FormattingConfigPort,
	FormattingConfigPortProps,
	FormattingFontFamilyState,
	FormattingFontSizeState,
	FormattingIndentationState,
	FormattingItalicState,
	FormattingLetterSpacingState,
	FormattingLineHeightState,
	FormattingLineLocalNameState,
	FormattingLineSpacingState,
	FormattingPublicPort,
	FormattingPublicPortProps,
	FormattingRemoveLineState,
	FormattingRemoveTextState,
	FormattingStrikethroughState,
	FormattingSubscriptState,
	FormattingSuperscriptState,
	FormattingTextAlignState,
	FormattingToggleButton,
	FormattingUnderlineState,
	OnFormattingChangeCallbackFn,
	UpdateStateParams,
} from "./FormattingAdapter-types";
import { isRemoveLineDisabled, isRemoveTextDisabled } from "./IsRemoveFormatDisabled";

export const createFormattingAdapter = (
	...params: CreateFormattingAdapterParams
): CreateFormattingAdapterResult => {
	const [{ whenMixed = "apply" }, { adapterBus }] = params;

	adapterBus.registerAdapter("formatting");

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

	// States
	const backgroundColorState = createStateEmitter<FormattingBackgroundColorState>({
		disabled: true,
		values: new Set(),
	});
	const boldState = createStateEmitter<FormattingBoldState>(
		createToggleButton({ disabled: true, pressed: "false" }),
	);
	const codeState = createStateEmitter<FormattingCodeState>(
		createToggleButton({ disabled: true, pressed: "false" }),
	);
	const colorState = createStateEmitter<FormattingColorState>({
		disabled: true,
		values: new Set(),
	});
	const fontFamilyState = createStateEmitter<FormattingFontFamilyState>({
		disabled: true,
		hasUnset: true,
		values: new Set(),
	});
	const fontSizeState = createStateEmitter<FormattingFontSizeState>({
		disabled: true,
		hasUnset: true,
		values: new Set(),
	});
	const indentationState = createStateEmitter<FormattingIndentationState>({
		disabled: true,
		hasUnset: true,
		values: new Set(),
	});
	const italicState = createStateEmitter<FormattingItalicState>(
		createToggleButton({ disabled: true, pressed: "false" }),
	);
	const letterSpacingState = createStateEmitter<FormattingLetterSpacingState>({
		disabled: true,
		values: new Set(),
	});
	const lineHeightState = createStateEmitter<FormattingLineHeightState>({
		disabled: true,
		hasUnset: true,
		values: new Set(),
	});
	const lineLocalNameState = createStateEmitter<FormattingLineLocalNameState>({
		disabled: true,
		values: new Set(),
	});
	const lineSpacingState = createStateEmitter<FormattingLineSpacingState>({
		disabled: true,
		hasUnset: true,
		values: new Set(),
	});
	const subscriptState = createStateEmitter<FormattingSubscriptState>(
		createToggleButton({ disabled: true, pressed: "false" }),
	);
	const superscriptState = createStateEmitter<FormattingSuperscriptState>(
		createToggleButton({ disabled: true, pressed: "false" }),
	);
	const strikethroughState = createStateEmitter<FormattingStrikethroughState>(
		createToggleButton({ disabled: true, pressed: "false" }),
	);
	const textAlignState = createStateEmitter<FormattingTextAlignState>({
		disabled: true,
		hasUnset: true,
		values: new Set(),
	});
	const underlineState = createStateEmitter<FormattingUnderlineState>(
		createToggleButton({ disabled: true, pressed: "false" }),
	);
	const removeLineState = createStateEmitter<FormattingRemoveLineState>({
		disabled: true,
	});
	const removeTextState = createStateEmitter<FormattingRemoveTextState>({
		disabled: true,
	});

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
			backgroundColorState.set(backgroundColor);
		}

		if (bold !== undefined) {
			boldState.set(createToggleButton(bold));
		}

		if (code !== undefined) {
			codeState.set(createToggleButton(code));
		}

		if (color !== undefined) {
			colorState.set(color);
		}

		if (fontFamily !== undefined) {
			fontFamilyState.set(fontFamily);
		}

		if (fontSize !== undefined) {
			fontSizeState.set(fontSize);
		}

		if (indentation !== undefined) {
			indentationState.set(indentation);
		}

		if (italic !== undefined) {
			italicState.set(createToggleButton(italic));
		}

		if (letterSpacing !== undefined) {
			letterSpacingState.set(letterSpacing);
		}

		if (lineHeight !== undefined) {
			lineHeightState.set(lineHeight);
		}

		if (lineLocalName !== undefined) {
			lineLocalNameState.set(lineLocalName);
		}

		if (lineSpacing !== undefined) {
			lineSpacingState.set(lineSpacing);
		}

		if (subscript !== undefined) {
			subscriptState.set(createToggleButton(subscript));
		}

		if (superscript !== undefined) {
			superscriptState.set(createToggleButton(superscript));
		}

		if (strikethrough !== undefined) {
			strikethroughState.set(createToggleButton(strikethrough));
		}

		if (textAlign !== undefined) {
			textAlignState.set(textAlign);
		}

		if (underline !== undefined) {
			underlineState.set(createToggleButton(underline));
		}

		const removeLineDisabled = isRemoveLineDisabled({
			indentation: indentationState.get(),
			lineHeight: lineHeightState.get(),
			lineSpacing: lineSpacingState.get(),
			textAlign: textAlignState.get(),
		});

		removeLineState.set({ disabled: removeLineDisabled });

		const removeTextDisabled = isRemoveTextDisabled({
			backgroundColor: backgroundColorState.get(),
			bold: boldState.get(),
			code: codeState.get(),
			color: colorState.get(),
			fontFamily: fontFamilyState.get(),
			fontSize: fontSizeState.get(),
			italic: italicState.get(),
			letterSpacing: letterSpacingState.get(),
			strikethrough: strikethroughState.get(),
			subscript: subscriptState.get(),
			superscript: superscriptState.get(),
			underline: underlineState.get(),
		});

		removeTextState.set({ disabled: removeTextDisabled });
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
			return backgroundColorState.get();
		},

		get bold() {
			return boldState.get();
		},

		get code() {
			return codeState.get();
		},

		get color() {
			return colorState.get();
		},

		get fontFamily() {
			return fontFamilyState.get();
		},

		get fontSize() {
			return fontSizeState.get();
		},

		get indentation() {
			return indentationState.get();
		},

		get italic() {
			return italicState.get();
		},

		get letterSpacing() {
			return letterSpacingState.get();
		},

		get lineHeight() {
			return lineHeightState.get();
		},

		get lineLocalName() {
			return lineLocalNameState.get();
		},

		get lineSpacing() {
			return lineSpacingState.get();
		},

		get subscript() {
			return subscriptState.get();
		},

		get superscript() {
			return superscriptState.get();
		},

		get strikethrough() {
			return strikethroughState.get();
		},

		get textAlign() {
			return textAlignState.get();
		},

		get underline() {
			return underlineState.get();
		},

		get removeLine() {
			return removeLineState.get();
		},

		get removeText() {
			return removeTextState.get();
		},

		onBackgroundColorUpdate(callback) {
			return backgroundColorState.subscribe(callback);
		},

		onBoldUpdate(callback) {
			return boldState.subscribe(callback);
		},

		onCodeUpdate(callback) {
			return codeState.subscribe(callback);
		},

		onColorUpdate(callback) {
			return colorState.subscribe(callback);
		},

		onFontFamilyUpdate(callback) {
			return fontFamilyState.subscribe(callback);
		},

		onFontSizeUpdate(callback) {
			return fontSizeState.subscribe(callback);
		},

		onIndentationUpdate(callback) {
			return indentationState.subscribe(callback);
		},

		onItalicUpdate(callback) {
			return italicState.subscribe(callback);
		},

		onLetterSpacingUpdate(callback) {
			return letterSpacingState.subscribe(callback);
		},

		onLineHeightUpdate(callback) {
			return lineHeightState.subscribe(callback);
		},

		onLineLocalNameUpdate(callback) {
			return lineLocalNameState.subscribe(callback);
		},

		onLineSpacingUpdate(callback) {
			return lineSpacingState.subscribe(callback);
		},

		onSubscriptUpdate(callback) {
			return subscriptState.subscribe(callback);
		},

		onSuperscriptUpdate(callback) {
			return superscriptState.subscribe(callback);
		},

		onStrikethroughUpdate(callback) {
			return strikethroughState.subscribe(callback);
		},

		onTextAlignUpdate(callback) {
			return textAlignState.subscribe(callback);
		},

		onUnderlineUpdate(callback) {
			return underlineState.subscribe(callback);
		},

		onRemoveLineUpdate(callback) {
			return removeLineState.subscribe(callback);
		},

		onRemoveTextUpdate(callback) {
			return removeTextState.subscribe(callback);
		},

		setBackgroundColor(backgroundColor) {
			formattingChangeEmitter.emit({ backgroundColor });
		},

		toggleBold() {
			formattingChangeEmitter.emit({ bold: boldState.get().pressed });
		},

		toggleCode() {
			formattingChangeEmitter.emit({ code: codeState.get().pressed });
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
			formattingChangeEmitter.emit({ italic: italicState.get().pressed });
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
			formattingChangeEmitter.emit({ subscript: subscriptState.get().pressed });
		},

		toggleSuperscript() {
			formattingChangeEmitter.emit({
				superscript: superscriptState.get().pressed,
			});
		},

		toggleStrikethrough() {
			formattingChangeEmitter.emit({
				strikethrough: strikethroughState.get().pressed,
			});
		},

		setTextAlign(textAlign) {
			formattingChangeEmitter.emit({ textAlign });
		},

		toggleUnderline() {
			formattingChangeEmitter.emit({ underline: underlineState.get().pressed });
		},

		removeLineFormat() {
			formattingChangeEmitter.emit({
				indentation: null,
				lineHeight: null,
				lineSpacing: null,
				textAlign: null,
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
