import { extendObjectProperties } from "#utilities";
import { defaultFontFamilyOptions } from "./FormattingAdapter-default";
import type {
	CreateFormattingAdapterParams,
	CreateFormattingAdapterResult,
	FormattingConfigPort,
	FormattingConfigPortProps,
	FormattingInternals,
	FormattingPublicPort,
	FormattingPublicPortProps,
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

	const internals: FormattingInternals = {
		backgroundColor: { disabled: true, values: new Set() },
		bold: { disabled: true, pressed: "false" },
		code: { disabled: true, pressed: "false" },
		color: { disabled: true, values: new Set() },
		fontFamily: { disabled: true, values: new Set() },
		fontSize: { disabled: true, values: new Set() },
		indentation: { disabled: true, values: new Set() },
		italic: { disabled: true, pressed: "false" },
		letterSpacing: { disabled: true, values: new Set() },
		lineHeight: { disabled: true, values: new Set() },
		lineLocalName: { disabled: true, values: new Set() },
		lineSpacing: { disabled: true, values: new Set() },
		subscript: { disabled: true, pressed: "false" },
		superscript: { disabled: true, pressed: "false" },
		strikethrough: { disabled: true, pressed: "false" },
		textAlign: { disabled: true, values: new Set() },
		underline: { disabled: true, pressed: "false" },
		removeLine: { disabled: true },
		removeText: { disabled: true },
		defaultFontFamily,
		defaultFontSize,
		defaultIndentation,
		defaultLineHeight,
		defaultLineSpacing,
		defaultTextAlign,
		fontFamilyOptions,
	};

	// ConfigPort
	const onFormattingChangeListeners: Set<OnFormattingChangeCallbackFn> =
		new Set();

	// PublicPort
	const onBackgroundColorUpdateListeners: Set<OnBackgroundColorUpdateCallbackFn> =
		new Set();
	const onBoldUpdateListeners: Set<OnBoldUpdateCallbackFn> = new Set();
	const onCodeUpdateListeners: Set<OnCodeUpdateCallbackFn> = new Set();
	const onColorUpdateListeners: Set<OnColorUpdateCallbackFn> = new Set();
	const onFontFamilyUpdateListeners: Set<OnFontFamilyUpdateCallbackFn> =
		new Set();
	const onFontSizeUpdateListeners: Set<OnFontSizeUpdateCallbackFn> = new Set();
	const onIndentationUpdateListeners: Set<OnIndentationUpdateCallbackFn> =
		new Set();
	const onItalicUpdateListeners: Set<OnItalicUpdateCallbackFn> = new Set();
	const onLetterSpacingUpdateListeners: Set<OnLetterSpacingUpdateCallbackFn> =
		new Set();
	const onLineHeightUpdateListeners: Set<OnLineHeightUpdateCallbackFn> =
		new Set();
	const onLineLocalNameUpdateListeners: Set<OnLineLocalNameUpdateCallbackFn> =
		new Set();
	const onLineSpacingUpdateListeners: Set<OnLineSpacingUpdateCallbackFn> =
		new Set();
	const onSubscriptUpdateListeners: Set<OnSubscriptUpdateCallbackFn> =
		new Set();
	const onSuperscriptUpdateListeners: Set<OnSuperscriptUpdateCallbackFn> =
		new Set();
	const onStrikethroughUpdateListeners: Set<OnStrikethroughUpdateCallbackFn> =
		new Set();
	const onTextAlignUpdateListeners: Set<OnTextAlignUpdateCallbackFn> =
		new Set();
	const onUnderlineUpdateListeners: Set<OnUnderlineUpdateCallbackFn> =
		new Set();
	const onRemoveLineUpdateListeners: Set<OnRemoveLineUpdateCallbackFn> =
		new Set();
	const onRemoveTextUpdateListeners: Set<OnRemoveTextUpdateCallbackFn> =
		new Set();

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

			for (const listener of onBackgroundColorUpdateListeners) {
				listener(internals.backgroundColor);
			}
		}

		if (bold !== undefined) {
			internals.bold = bold;

			for (const listener of onBoldUpdateListeners) {
				listener(internals.bold);
			}
		}

		if (code !== undefined) {
			internals.code = code;

			for (const listener of onCodeUpdateListeners) {
				listener(internals.code);
			}
		}

		if (color !== undefined) {
			internals.color = color;

			for (const listener of onColorUpdateListeners) {
				listener(internals.color);
			}
		}

		if (fontFamily !== undefined) {
			internals.fontFamily = fontFamily;

			for (const listener of onFontFamilyUpdateListeners) {
				listener(internals.fontFamily);
			}
		}

		if (fontSize !== undefined) {
			internals.fontSize = fontSize;

			for (const listener of onFontSizeUpdateListeners) {
				listener(internals.fontSize);
			}
		}

		if (indentation !== undefined) {
			internals.indentation = indentation;

			for (const listener of onIndentationUpdateListeners) {
				listener(internals.indentation);
			}
		}

		if (italic !== undefined) {
			internals.italic = italic;

			for (const listener of onItalicUpdateListeners) {
				listener(internals.italic);
			}
		}

		if (letterSpacing !== undefined) {
			internals.letterSpacing = letterSpacing;

			for (const listener of onLetterSpacingUpdateListeners) {
				listener(internals.letterSpacing);
			}
		}

		if (lineHeight !== undefined) {
			internals.lineHeight = lineHeight;

			for (const listener of onLineHeightUpdateListeners) {
				listener(internals.lineHeight);
			}
		}

		if (lineLocalName !== undefined) {
			internals.lineLocalName = lineLocalName;

			for (const listener of onLineLocalNameUpdateListeners) {
				listener(internals.lineLocalName);
			}
		}

		if (lineSpacing !== undefined) {
			internals.lineSpacing = lineSpacing;

			for (const listener of onLineSpacingUpdateListeners) {
				listener(internals.lineSpacing);
			}
		}

		if (subscript !== undefined) {
			internals.subscript = subscript;

			for (const listener of onSubscriptUpdateListeners) {
				listener(internals.subscript);
			}
		}

		if (superscript !== undefined) {
			internals.superscript = superscript;

			for (const listener of onSuperscriptUpdateListeners) {
				listener(internals.superscript);
			}
		}

		if (strikethrough !== undefined) {
			internals.strikethrough = strikethrough;

			for (const listener of onStrikethroughUpdateListeners) {
				listener(internals.strikethrough);
			}
		}

		if (textAlign !== undefined) {
			internals.textAlign = textAlign;

			for (const listener of onTextAlignUpdateListeners) {
				listener(internals.textAlign);
			}
		}

		if (underline !== undefined) {
			internals.underline = underline;

			for (const listener of onUnderlineUpdateListeners) {
				listener(internals.underline);
			}
		}

		const removeLineDisabled = isRemoveLineDisabled(internals);

		internals.removeLine = { disabled: removeLineDisabled };

		for (const listener of onRemoveLineUpdateListeners) {
			listener(internals.removeLine);
		}

		const removeTextDisabled = isRemoveTextDisabled(internals);

		internals.removeText = { disabled: removeTextDisabled };

		for (const listener of onRemoveTextUpdateListeners) {
			listener(internals.removeText);
		}
	};

	const configPort: FormattingConfigPort = extendObjectProperties({}, {
		get whenMixed() {
			return whenMixed;
		},

		updateState(params) {
			updateState(params);
		},

		onFormattingChange(callback) {
			onFormattingChangeListeners.add(callback);
			return () => onFormattingChangeListeners.delete(callback);
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
			onBackgroundColorUpdateListeners.add(callback);
			return () => onBackgroundColorUpdateListeners.delete(callback);
		},

		onBoldUpdate(callback) {
			onBoldUpdateListeners.add(callback);
			return () => onBoldUpdateListeners.delete(callback);
		},

		onCodeUpdate(callback) {
			onCodeUpdateListeners.add(callback);
			return () => onCodeUpdateListeners.delete(callback);
		},

		onColorUpdate(callback) {
			onColorUpdateListeners.add(callback);
			return () => onColorUpdateListeners.delete(callback);
		},

		onFontFamilyUpdate(callback) {
			onFontFamilyUpdateListeners.add(callback);
			return () => onFontFamilyUpdateListeners.delete(callback);
		},

		onFontSizeUpdate(callback) {
			onFontSizeUpdateListeners.add(callback);
			return () => onFontSizeUpdateListeners.delete(callback);
		},

		onIndentationUpdate(callback) {
			onIndentationUpdateListeners.add(callback);
			return () => onIndentationUpdateListeners.delete(callback);
		},

		onItalicUpdate(callback) {
			onItalicUpdateListeners.add(callback);
			return () => onItalicUpdateListeners.delete(callback);
		},

		onLetterSpacingUpdate(callback) {
			onLetterSpacingUpdateListeners.add(callback);
			return () => onLetterSpacingUpdateListeners.delete(callback);
		},

		onLineHeightUpdate(callback) {
			onLineHeightUpdateListeners.add(callback);
			return () => onLineHeightUpdateListeners.delete(callback);
		},

		onLineLocalNameUpdate(callback) {
			onLineLocalNameUpdateListeners.add(callback);
			return () => onLineLocalNameUpdateListeners.delete(callback);
		},

		onLineSpacingUpdate(callback) {
			onLineSpacingUpdateListeners.add(callback);
			return () => onLineSpacingUpdateListeners.delete(callback);
		},

		onSubscriptUpdate(callback) {
			onSubscriptUpdateListeners.add(callback);
			return () => onSubscriptUpdateListeners.delete(callback);
		},

		onSuperscriptUpdate(callback) {
			onSuperscriptUpdateListeners.add(callback);
			return () => onSuperscriptUpdateListeners.delete(callback);
		},

		onStrikethroughUpdate(callback) {
			onStrikethroughUpdateListeners.add(callback);
			return () => onStrikethroughUpdateListeners.delete(callback);
		},

		onTextAlignUpdate(callback) {
			onTextAlignUpdateListeners.add(callback);
			return () => onTextAlignUpdateListeners.delete(callback);
		},

		onUnderlineUpdate(callback) {
			onUnderlineUpdateListeners.add(callback);
			return () => onUnderlineUpdateListeners.delete(callback);
		},

		onRemoveLineUpdate(callback) {
			onRemoveLineUpdateListeners.add(callback);
			return () => onRemoveLineUpdateListeners.delete(callback);
		},

		onRemoveTextUpdate(callback) {
			onRemoveTextUpdateListeners.add(callback);
			return () => onRemoveTextUpdateListeners.delete(callback);
		},

		setBackgroundColor(backgroundColor) {
			for (const listener of onFormattingChangeListeners) {
				listener({ backgroundColor });
			}
		},

		toggleBold() {
			for (const listener of onFormattingChangeListeners) {
				listener({ bold: internals.bold.pressed });
			}
		},

		toggleCode() {
			for (const listener of onFormattingChangeListeners) {
				listener({ code: internals.code.pressed });
			}
		},

		setColor(color) {
			for (const listener of onFormattingChangeListeners) {
				listener({ color });
			}
		},

		setFontFamily(fontFamily) {
			for (const listener of onFormattingChangeListeners) {
				listener({ fontFamily });
			}
		},

		setFontSize(fontSize) {
			for (const listener of onFormattingChangeListeners) {
				listener({ fontSize });
			}
		},

		setIndentation(indentation) {
			for (const listener of onFormattingChangeListeners) {
				listener({ indentation });
			}
		},

		toggleItalic() {
			for (const listener of onFormattingChangeListeners) {
				listener({ italic: internals.italic.pressed });
			}
		},

		setLetterSpacing(letterSpacing) {
			for (const listener of onFormattingChangeListeners) {
				listener({ letterSpacing });
			}
		},

		setLineHeight(lineHeight) {
			for (const listener of onFormattingChangeListeners) {
				listener({ lineHeight });
			}
		},

		setLineLocalName(lineLocalName) {
			for (const listener of onFormattingChangeListeners) {
				listener({ lineLocalName });
			}
		},

		setLineSpacing(lineSpacing) {
			for (const listener of onFormattingChangeListeners) {
				listener({ lineSpacing });
			}
		},

		toggleSubscript() {
			for (const listener of onFormattingChangeListeners) {
				listener({ subscript: internals.subscript.pressed });
			}
		},

		toggleSuperscript() {
			for (const listener of onFormattingChangeListeners) {
				listener({ superscript: internals.superscript.pressed });
			}
		},

		toggleStrikethrough() {
			for (const listener of onFormattingChangeListeners) {
				listener({ strikethrough: internals.strikethrough.pressed });
			}
		},

		setTextAlign(textAlign) {
			for (const listener of onFormattingChangeListeners) {
				listener({ textAlign });
			}
		},

		toggleUnderline() {
			for (const listener of onFormattingChangeListeners) {
				listener({ underline: internals.underline.pressed });
			}
		},

		removeLineFormat() {
			for (const listener of onFormattingChangeListeners) {
				listener({
					indentation: internals.defaultIndentation,
					lineHeight: internals.defaultLineHeight,
					lineSpacing: internals.defaultLineSpacing,
					textAlign: internals.defaultTextAlign,
				});
			}
		},

		// Each toggle field is sent as "true" — not the value to set, but the
		// currently-applied state the Editor is being told to turn off. Toggle
		// fields in FormattingActionState always mean "this is on, flip it."
		removeTextFormat() {
			for (const listener of onFormattingChangeListeners) {
				listener({
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
			}
		},
	} satisfies FormattingPublicPortProps);

	return { configPort, publicPort };
};
