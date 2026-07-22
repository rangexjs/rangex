import type {
	FormattingActionState,
	FormattingAdapterConstructorParams,
	FormattingBackgroundColorState,
	FormattingBoldState,
	FormattingCodeState,
	FormattingColorState,
	FormattingEditorPort,
	FormattingFontFamilyState,
	FormattingFontFamilyValue,
	FormattingFontSizeState,
	FormattingFontSizeValue,
	FormattingIndentationState,
	FormattingIndentationValue,
	FormattingItalicState,
	FormattingLetterSpacingState,
	FormattingLineHeightState,
	FormattingLineHeightValue,
	FormattingLineLocalNameState,
	FormattingLineSpacingState,
	FormattingLineSpacingValue,
	FormattingStrikethroughState,
	FormattingSubscriptState,
	FormattingSuperscriptState,
	FormattingTextAlignState,
	FormattingTextAlignValue,
	FormattingUIPort,
	FormattingUnderlineState,
	FormattingUpdateBackgroundColorFn,
	FormattingUpdateBoldFn,
	FormattingUpdateCodeFn,
	FormattingUpdateColorFn,
	FormattingUpdateFontFamilyFn,
	FormattingUpdateFontSizeFn,
	FormattingUpdateIndentationFn,
	FormattingUpdateItalicFn,
	FormattingUpdateLetterSpacingFn,
	FormattingUpdateLineHeightFn,
	FormattingUpdateLineLocalNameFn,
	FormattingUpdateLineSpacingFn,
	FormattingUpdateStrikethroughFn,
	FormattingUpdateSubscriptFn,
	FormattingUpdateSuperscriptFn,
	FormattingUpdateTextAlignFn,
	FormattingUpdateUnderlineFn,
	OnAnyFieldUpdateFn,
	OnFormattingChangeFn,
	UpdateFormattingStateParams,
} from "./FormattingAdapter-types";

export class FormattingAdapter {
	#backgroundColor: FormattingBackgroundColorState = {
		disabled: true,
		values: new Set(),
	};
	#bold: FormattingBoldState = { disabled: true, pressed: "false" };
	#code: FormattingCodeState = { disabled: true, pressed: "false" };
	#color: FormattingColorState = { disabled: true, values: new Set() };
	#fontFamily: FormattingFontFamilyState = {
		disabled: true,
		values: new Set(),
	};
	#fontSize: FormattingFontSizeState = { disabled: true, values: new Set() };
	#indentation: FormattingIndentationState = {
		disabled: true,
		values: new Set(),
	};
	#italic: FormattingItalicState = { disabled: true, pressed: "false" };
	#letterSpacing: FormattingLetterSpacingState = {
		disabled: true,
		values: new Set(),
	};
	#lineHeight: FormattingLineHeightState = {
		disabled: true,
		values: new Set(),
	};
	#lineLocalName: FormattingLineLocalNameState = {
		disabled: true,
		values: new Set(),
	};
	#lineSpacing: FormattingLineSpacingState = {
		disabled: true,
		values: new Set(),
	};
	#subscript: FormattingSubscriptState = { disabled: true, pressed: "false" };
	#superscript: FormattingSuperscriptState = {
		disabled: true,
		pressed: "false",
	};
	#strikethrough: FormattingStrikethroughState = {
		disabled: true,
		pressed: "false",
	};
	#textAlign: FormattingTextAlignState = { disabled: true, values: new Set() };
	#underline: FormattingUnderlineState = { disabled: true, pressed: "false" };

	#defaultFontFamily: FormattingFontFamilyValue;
	#defaultFontSize: FormattingFontSizeValue;
	#defaultIndentation: FormattingIndentationValue;
	#defaultLineHeight: FormattingLineHeightValue;
	#defaultLineSpacing: FormattingLineSpacingValue;
	#defaultTextAlign: FormattingTextAlignValue;

	#backgroundColorListeners: Set<FormattingUpdateBackgroundColorFn> = new Set();
	#boldListeners: Set<FormattingUpdateBoldFn> = new Set();
	#codeListeners: Set<FormattingUpdateCodeFn> = new Set();
	#colorListeners: Set<FormattingUpdateColorFn> = new Set();
	#fontFamilyListeners: Set<FormattingUpdateFontFamilyFn> = new Set();
	#fontSizeListeners: Set<FormattingUpdateFontSizeFn> = new Set();
	#indentationListeners: Set<FormattingUpdateIndentationFn> = new Set();
	#italicListeners: Set<FormattingUpdateItalicFn> = new Set();
	#letterSpacingListeners: Set<FormattingUpdateLetterSpacingFn> = new Set();
	#lineHeightListeners: Set<FormattingUpdateLineHeightFn> = new Set();
	#lineLocalNameListeners: Set<FormattingUpdateLineLocalNameFn> = new Set();
	#lineSpacingListeners: Set<FormattingUpdateLineSpacingFn> = new Set();
	#subscriptListeners: Set<FormattingUpdateSubscriptFn> = new Set();
	#superscriptListeners: Set<FormattingUpdateSuperscriptFn> = new Set();
	#strikethroughListeners: Set<FormattingUpdateStrikethroughFn> = new Set();
	#textAlignListeners: Set<FormattingUpdateTextAlignFn> = new Set();
	#underlineListeners: Set<FormattingUpdateUnderlineFn> = new Set();

	#onFormattingChangeListeners: Set<OnFormattingChangeFn> = new Set();
	#onAnyFieldUpdateListeners: Set<OnAnyFieldUpdateFn> = new Set();

	constructor({
		defaultFontFamily = "Inter",
		defaultFontSize = { type: "px", value: 16 },
		defaultIndentation = { type: "px", value: 0 },
		defaultLineHeight = { type: "number", value: 1.5 },
		defaultLineSpacing = { type: "px", value: 0 },
		defaultTextAlign = "start",
	}: FormattingAdapterConstructorParams) {
		this.#defaultFontFamily = defaultFontFamily;
		this.#defaultFontSize = defaultFontSize;
		this.#defaultIndentation = defaultIndentation;
		this.#defaultLineHeight = defaultLineHeight;
		this.#defaultLineSpacing = defaultLineSpacing;
		this.#defaultTextAlign = defaultTextAlign;
	}

	#updateState({
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
	}: UpdateFormattingStateParams) {
		if (backgroundColor !== undefined) {
			this.#backgroundColor = backgroundColor;

			for (const listener of this.#backgroundColorListeners) {
				listener(this.#backgroundColor);
			}
		}

		if (bold !== undefined) {
			this.#bold = bold;

			for (const listener of this.#boldListeners) {
				listener(this.#bold);
			}
		}

		if (code !== undefined) {
			this.#code = code;

			for (const listener of this.#codeListeners) {
				listener(this.#code);
			}
		}

		if (color !== undefined) {
			this.#color = color;

			for (const listener of this.#colorListeners) {
				listener(this.#color);
			}
		}

		if (fontFamily !== undefined) {
			this.#fontFamily = fontFamily;

			for (const listener of this.#fontFamilyListeners) {
				listener(this.#fontFamily);
			}
		}

		if (fontSize !== undefined) {
			this.#fontSize = fontSize;

			for (const listener of this.#fontSizeListeners) {
				listener(this.#fontSize);
			}
		}

		if (indentation !== undefined) {
			this.#indentation = indentation;

			for (const listener of this.#indentationListeners) {
				listener(this.#indentation);
			}
		}

		if (italic !== undefined) {
			this.#italic = italic;

			for (const listener of this.#italicListeners) {
				listener(this.#italic);
			}
		}

		if (letterSpacing !== undefined) {
			this.#letterSpacing = letterSpacing;

			for (const listener of this.#letterSpacingListeners) {
				listener(this.#letterSpacing);
			}
		}

		if (lineHeight !== undefined) {
			this.#lineHeight = lineHeight;

			for (const listener of this.#lineHeightListeners) {
				listener(this.#lineHeight);
			}
		}

		if (lineLocalName !== undefined) {
			this.#lineLocalName = lineLocalName;

			for (const listener of this.#lineLocalNameListeners) {
				listener(this.#lineLocalName);
			}
		}

		if (lineSpacing !== undefined) {
			this.#lineSpacing = lineSpacing;

			for (const listener of this.#lineSpacingListeners) {
				listener(this.#lineSpacing);
			}
		}

		if (subscript !== undefined) {
			this.#subscript = subscript;

			for (const listener of this.#subscriptListeners) {
				listener(this.#subscript);
			}
		}

		if (superscript !== undefined) {
			this.#superscript = superscript;

			for (const listener of this.#superscriptListeners) {
				listener(this.#superscript);
			}
		}

		if (strikethrough !== undefined) {
			this.#strikethrough = strikethrough;

			for (const listener of this.#strikethroughListeners) {
				listener(this.#strikethrough);
			}
		}

		if (textAlign !== undefined) {
			this.#textAlign = textAlign;

			for (const listener of this.#textAlignListeners) {
				listener(this.#textAlign);
			}
		}

		if (underline !== undefined) {
			this.#underline = underline;

			for (const listener of this.#underlineListeners) {
				listener(this.#underline);
			}
		}

		for (const listener of this.#onAnyFieldUpdateListeners) {
			listener();
		}
	}

	get uiPort(): FormattingUIPort {
		const adapter = this;

		return {
			get backgroundColor() {
				return adapter.#backgroundColor;
			},

			get bold() {
				return adapter.#bold;
			},

			get code() {
				return adapter.#code;
			},

			get color() {
				return adapter.#color;
			},

			get fontFamily() {
				return adapter.#fontFamily;
			},

			get fontSize() {
				return adapter.#fontSize;
			},

			get indentation() {
				return adapter.#indentation;
			},

			get italic() {
				return adapter.#italic;
			},

			get letterSpacing() {
				return adapter.#letterSpacing;
			},

			get lineHeight() {
				return adapter.#lineHeight;
			},

			get lineLocalName() {
				return adapter.#lineLocalName;
			},

			get lineSpacing() {
				return adapter.#lineSpacing;
			},

			get subscript() {
				return adapter.#subscript;
			},

			get superscript() {
				return adapter.#superscript;
			},

			get strikethrough() {
				return adapter.#strikethrough;
			},

			get textAlign() {
				return adapter.#textAlign;
			},

			get underline() {
				return adapter.#underline;
			},

			get defaultFontFamily() {
				return adapter.#defaultFontFamily;
			},

			get defaultFontSize() {
				return adapter.#defaultFontSize;
			},

			get defaultIndentation() {
				return adapter.#defaultIndentation;
			},

			get defaultLineHeight() {
				return adapter.#defaultLineHeight;
			},

			get defaultLineSpacing() {
				return adapter.#defaultLineSpacing;
			},

			get defaultTextAlign() {
				return adapter.#defaultTextAlign;
			},

			onBackgroundColorUpdate: (callback) => {
				adapter.#backgroundColorListeners.add(callback);
				return () => adapter.#backgroundColorListeners.delete(callback);
			},

			onBoldUpdate: (callback) => {
				adapter.#boldListeners.add(callback);
				return () => adapter.#boldListeners.delete(callback);
			},

			onCodeUpdate: (callback) => {
				adapter.#codeListeners.add(callback);
				return () => adapter.#codeListeners.delete(callback);
			},

			onColorUpdate: (callback) => {
				adapter.#colorListeners.add(callback);
				return () => adapter.#colorListeners.delete(callback);
			},

			onFontFamilyUpdate: (callback) => {
				adapter.#fontFamilyListeners.add(callback);
				return () => adapter.#fontFamilyListeners.delete(callback);
			},

			onFontSizeUpdate: (callback) => {
				adapter.#fontSizeListeners.add(callback);
				return () => adapter.#fontSizeListeners.delete(callback);
			},

			onIndentationUpdate: (callback) => {
				adapter.#indentationListeners.add(callback);
				return () => adapter.#indentationListeners.delete(callback);
			},

			onItalicUpdate: (callback) => {
				adapter.#italicListeners.add(callback);
				return () => adapter.#italicListeners.delete(callback);
			},

			onLetterSpacingUpdate: (callback) => {
				adapter.#letterSpacingListeners.add(callback);
				return () => adapter.#letterSpacingListeners.delete(callback);
			},

			onLineHeightUpdate: (callback) => {
				adapter.#lineHeightListeners.add(callback);
				return () => adapter.#lineHeightListeners.delete(callback);
			},

			onLineLocalNameUpdate: (callback) => {
				adapter.#lineLocalNameListeners.add(callback);
				return () => adapter.#lineLocalNameListeners.delete(callback);
			},

			onLineSpacingUpdate: (callback) => {
				adapter.#lineSpacingListeners.add(callback);
				return () => adapter.#lineSpacingListeners.delete(callback);
			},

			onSubscriptUpdate: (callback) => {
				adapter.#subscriptListeners.add(callback);
				return () => adapter.#subscriptListeners.delete(callback);
			},

			onSuperscriptUpdate: (callback) => {
				adapter.#superscriptListeners.add(callback);
				return () => adapter.#superscriptListeners.delete(callback);
			},

			onStrikethroughUpdate: (callback) => {
				adapter.#strikethroughListeners.add(callback);
				return () => adapter.#strikethroughListeners.delete(callback);
			},

			onTextAlignUpdate: (callback) => {
				adapter.#textAlignListeners.add(callback);
				return () => adapter.#textAlignListeners.delete(callback);
			},

			onUnderlineUpdate: (callback) => {
				adapter.#underlineListeners.add(callback);
				return () => adapter.#underlineListeners.delete(callback);
			},

			onAnyFieldUpdate: (callback) => {
				adapter.#onAnyFieldUpdateListeners.add(callback);
				return () => adapter.#onAnyFieldUpdateListeners.delete(callback);
			},

			emitFormattingChange: (params: FormattingActionState) => {
				for (const listener of adapter.#onFormattingChangeListeners) {
					listener(params);
				}
			},
		};
	}

	get editorPort(): FormattingEditorPort {
		const adapter = this;

		return {
			updateState: (params) => adapter.#updateState(params),

			onFormattingChange: (callback) => {
				adapter.#onFormattingChangeListeners.add(callback);
				return () => adapter.#onFormattingChangeListeners.delete(callback);
			},
		};
	}
}
