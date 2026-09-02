import { defaultFontFamilyOptions } from "./FormattingAdapter-default";
import type {
	ConstructorParams,
	FontFamilyOption,
	FormattingActionState,
	FormattingBackgroundColorState,
	FormattingBoldState,
	FormattingCodeState,
	FormattingColorState,
	FormattingConfigPort,
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
	FormattingPublicPort,
	FormattingStrikethroughState,
	FormattingSubscriptState,
	FormattingSuperscriptState,
	FormattingTextAlignState,
	FormattingTextAlignValue,
	FormattingUnderlineState,
	OnAnyFieldUpdateFn,
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
	OnStrikethroughUpdateCallbackFn,
	OnSubscriptUpdateCallbackFn,
	OnSuperscriptUpdateCallbackFn,
	OnTextAlignUpdateCallbackFn,
	OnUnderlineUpdateCallbackFn,
	UpdateStateParams,
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

	#fontFamilyOptions: FontFamilyOption[];

	// ConfigPort
	#onFormattingChangeListeners: Set<OnFormattingChangeCallbackFn> = new Set();

	// PublicPort
	#onBackgroundColorUpdateListeners: Set<OnBackgroundColorUpdateCallbackFn> =
		new Set();
	#onBoldUpdateListeners: Set<OnBoldUpdateCallbackFn> = new Set();
	#onCodeUpdateListeners: Set<OnCodeUpdateCallbackFn> = new Set();
	#onColorUpdateListeners: Set<OnColorUpdateCallbackFn> = new Set();
	#onFontFamilyUpdateListeners: Set<OnFontFamilyUpdateCallbackFn> = new Set();
	#onFontSizeUpdateListeners: Set<OnFontSizeUpdateCallbackFn> = new Set();
	#onIndentationUpdateListeners: Set<OnIndentationUpdateCallbackFn> = new Set();
	#onItalicUpdateListeners: Set<OnItalicUpdateCallbackFn> = new Set();
	#onLetterSpacingUpdateListeners: Set<OnLetterSpacingUpdateCallbackFn> =
		new Set();
	#onLineHeightUpdateListeners: Set<OnLineHeightUpdateCallbackFn> = new Set();
	#onLineLocalNameUpdateListeners: Set<OnLineLocalNameUpdateCallbackFn> =
		new Set();
	#onLineSpacingUpdateListeners: Set<OnLineSpacingUpdateCallbackFn> = new Set();
	#onSubscriptUpdateListeners: Set<OnSubscriptUpdateCallbackFn> = new Set();
	#onSuperscriptUpdateListeners: Set<OnSuperscriptUpdateCallbackFn> = new Set();
	#onStrikethroughUpdateListeners: Set<OnStrikethroughUpdateCallbackFn> =
		new Set();
	#onTextAlignUpdateListeners: Set<OnTextAlignUpdateCallbackFn> = new Set();
	#onUnderlineUpdateListeners: Set<OnUnderlineUpdateCallbackFn> = new Set();
	#onAnyFieldUpdateListeners: Set<OnAnyFieldUpdateFn> = new Set();

	#configPort: FormattingConfigPort | null = null;
	#publicPort: FormattingPublicPort | null = null;

	constructor(...params: ConstructorParams) {
		const [
			{
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

		this.#defaultFontFamily = defaultFontFamily;
		this.#defaultFontSize = defaultFontSize;
		this.#defaultIndentation = defaultIndentation;
		this.#defaultLineHeight = defaultLineHeight;
		this.#defaultLineSpacing = defaultLineSpacing;
		this.#defaultTextAlign = defaultTextAlign;
		this.#fontFamilyOptions = fontFamilyOptions;
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
	}: UpdateStateParams) {
		if (backgroundColor !== undefined) {
			this.#backgroundColor = backgroundColor;

			for (const listener of this.#onBackgroundColorUpdateListeners) {
				listener(this.#backgroundColor);
			}
		}

		if (bold !== undefined) {
			this.#bold = bold;

			for (const listener of this.#onBoldUpdateListeners) {
				listener(this.#bold);
			}
		}

		if (code !== undefined) {
			this.#code = code;

			for (const listener of this.#onCodeUpdateListeners) {
				listener(this.#code);
			}
		}

		if (color !== undefined) {
			this.#color = color;

			for (const listener of this.#onColorUpdateListeners) {
				listener(this.#color);
			}
		}

		if (fontFamily !== undefined) {
			this.#fontFamily = fontFamily;

			for (const listener of this.#onFontFamilyUpdateListeners) {
				listener(this.#fontFamily);
			}
		}

		if (fontSize !== undefined) {
			this.#fontSize = fontSize;

			for (const listener of this.#onFontSizeUpdateListeners) {
				listener(this.#fontSize);
			}
		}

		if (indentation !== undefined) {
			this.#indentation = indentation;

			for (const listener of this.#onIndentationUpdateListeners) {
				listener(this.#indentation);
			}
		}

		if (italic !== undefined) {
			this.#italic = italic;

			for (const listener of this.#onItalicUpdateListeners) {
				listener(this.#italic);
			}
		}

		if (letterSpacing !== undefined) {
			this.#letterSpacing = letterSpacing;

			for (const listener of this.#onLetterSpacingUpdateListeners) {
				listener(this.#letterSpacing);
			}
		}

		if (lineHeight !== undefined) {
			this.#lineHeight = lineHeight;

			for (const listener of this.#onLineHeightUpdateListeners) {
				listener(this.#lineHeight);
			}
		}

		if (lineLocalName !== undefined) {
			this.#lineLocalName = lineLocalName;

			for (const listener of this.#onLineLocalNameUpdateListeners) {
				listener(this.#lineLocalName);
			}
		}

		if (lineSpacing !== undefined) {
			this.#lineSpacing = lineSpacing;

			for (const listener of this.#onLineSpacingUpdateListeners) {
				listener(this.#lineSpacing);
			}
		}

		if (subscript !== undefined) {
			this.#subscript = subscript;

			for (const listener of this.#onSubscriptUpdateListeners) {
				listener(this.#subscript);
			}
		}

		if (superscript !== undefined) {
			this.#superscript = superscript;

			for (const listener of this.#onSuperscriptUpdateListeners) {
				listener(this.#superscript);
			}
		}

		if (strikethrough !== undefined) {
			this.#strikethrough = strikethrough;

			for (const listener of this.#onStrikethroughUpdateListeners) {
				listener(this.#strikethrough);
			}
		}

		if (textAlign !== undefined) {
			this.#textAlign = textAlign;

			for (const listener of this.#onTextAlignUpdateListeners) {
				listener(this.#textAlign);
			}
		}

		if (underline !== undefined) {
			this.#underline = underline;

			for (const listener of this.#onUnderlineUpdateListeners) {
				listener(this.#underline);
			}
		}

		for (const listener of this.#onAnyFieldUpdateListeners) {
			listener();
		}
	}

	get configPort(): FormattingConfigPort {
		const adapter = this;

		this.#configPort ??= {
			updateState(params) {
				adapter.#updateState(params);
			},

			onFormattingChange(callback) {
				adapter.#onFormattingChangeListeners.add(callback);
				return () => adapter.#onFormattingChangeListeners.delete(callback);
			},
		};

		return this.#configPort;
	}

	get publicPort(): FormattingPublicPort {
		const adapter = this;

		this.#publicPort ??= {
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

			get fontFamilyOptions() {
				return adapter.#fontFamilyOptions;
			},

			onBackgroundColorUpdate(callback) {
				adapter.#onBackgroundColorUpdateListeners.add(callback);
				return () => adapter.#onBackgroundColorUpdateListeners.delete(callback);
			},

			onBoldUpdate(callback) {
				adapter.#onBoldUpdateListeners.add(callback);
				return () => adapter.#onBoldUpdateListeners.delete(callback);
			},

			onCodeUpdate(callback) {
				adapter.#onCodeUpdateListeners.add(callback);
				return () => adapter.#onCodeUpdateListeners.delete(callback);
			},

			onColorUpdate(callback) {
				adapter.#onColorUpdateListeners.add(callback);
				return () => adapter.#onColorUpdateListeners.delete(callback);
			},

			onFontFamilyUpdate(callback) {
				adapter.#onFontFamilyUpdateListeners.add(callback);
				return () => adapter.#onFontFamilyUpdateListeners.delete(callback);
			},

			onFontSizeUpdate(callback) {
				adapter.#onFontSizeUpdateListeners.add(callback);
				return () => adapter.#onFontSizeUpdateListeners.delete(callback);
			},

			onIndentationUpdate(callback) {
				adapter.#onIndentationUpdateListeners.add(callback);
				return () => adapter.#onIndentationUpdateListeners.delete(callback);
			},

			onItalicUpdate(callback) {
				adapter.#onItalicUpdateListeners.add(callback);
				return () => adapter.#onItalicUpdateListeners.delete(callback);
			},

			onLetterSpacingUpdate(callback) {
				adapter.#onLetterSpacingUpdateListeners.add(callback);
				return () => adapter.#onLetterSpacingUpdateListeners.delete(callback);
			},

			onLineHeightUpdate(callback) {
				adapter.#onLineHeightUpdateListeners.add(callback);
				return () => adapter.#onLineHeightUpdateListeners.delete(callback);
			},

			onLineLocalNameUpdate(callback) {
				adapter.#onLineLocalNameUpdateListeners.add(callback);
				return () => adapter.#onLineLocalNameUpdateListeners.delete(callback);
			},

			onLineSpacingUpdate(callback) {
				adapter.#onLineSpacingUpdateListeners.add(callback);
				return () => adapter.#onLineSpacingUpdateListeners.delete(callback);
			},

			onSubscriptUpdate(callback) {
				adapter.#onSubscriptUpdateListeners.add(callback);
				return () => adapter.#onSubscriptUpdateListeners.delete(callback);
			},

			onSuperscriptUpdate(callback) {
				adapter.#onSuperscriptUpdateListeners.add(callback);
				return () => adapter.#onSuperscriptUpdateListeners.delete(callback);
			},

			onStrikethroughUpdate(callback) {
				adapter.#onStrikethroughUpdateListeners.add(callback);
				return () => adapter.#onStrikethroughUpdateListeners.delete(callback);
			},

			onTextAlignUpdate(callback) {
				adapter.#onTextAlignUpdateListeners.add(callback);
				return () => adapter.#onTextAlignUpdateListeners.delete(callback);
			},

			onUnderlineUpdate(callback) {
				adapter.#onUnderlineUpdateListeners.add(callback);
				return () => adapter.#onUnderlineUpdateListeners.delete(callback);
			},

			onAnyFieldUpdate(callback) {
				adapter.#onAnyFieldUpdateListeners.add(callback);
				return () => adapter.#onAnyFieldUpdateListeners.delete(callback);
			},

			changeFormat(params: FormattingActionState) {
				for (const listener of adapter.#onFormattingChangeListeners) {
					listener(params);
				}
			},
		};

		return this.#publicPort;
	}
}
