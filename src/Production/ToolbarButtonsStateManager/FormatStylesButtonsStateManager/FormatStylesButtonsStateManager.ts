import { toolbarButtonsName } from "../../Constants";
import { assertNever } from "../../ErrorHandling";
import type {
	BackgroundColorToolbarButtonState,
	BoldToolbarButtonState,
	CodeToolbarButtonState,
	ColorToolbarButtonState,
	FontFamilyToolbarButtonState,
	FontSizeToolbarButtonState,
	IndentationToolbarButtonState,
	ItalicToolbarButtonState,
	LetterSpacingToolbarButtonState,
	LineHeightToolbarButtonState,
	LineLocalNameToolbarButtonState,
	LineSpacingToolbarButtonState,
	StrikethroughToolbarButtonState,
	SubscriptToolbarButtonState,
	SuperscriptToolbarButtonState,
	TextAlignToolbarButtonState,
	UnderlineToolbarButtonState,
} from "../../ToolbarButtonProps";
import type {
	ListenerOption,
	StateChangeFn,
	UpdateBackgroundColorStateFn,
	UpdateBoldStateFn,
	UpdateCodeStateFn,
	UpdateColorStateFn,
	UpdateFontFamilyStateFn,
	UpdateFontSizeStateFn,
	UpdateFormatStylesButtonsStateParams,
	UpdateIndentationStateFn,
	UpdateItalicStateFn,
	UpdateLetterSpacingStateFn,
	UpdateLineHeightStateFn,
	UpdateLineLocalNameStateFn,
	UpdateLineSpacingStateFn,
	UpdateListenerParams,
	UpdateStrikethroughStateFn,
	UpdateSubscriptStateFn,
	UpdateSuperscriptStateFn,
	UpdateTextAlignStateFn,
	UpdateUnderlineStateFn,
} from "./FormatStylesButtonsStateManager-types";

export class FormatStylesButtonsStateManager {
	#backgroundColor: BackgroundColorToolbarButtonState = {
		disabled: true,
		values: new Set(),
	};
	#bold: BoldToolbarButtonState = {
		disabled: true,
		pressed: "false",
	};
	#code: CodeToolbarButtonState = {
		disabled: true,
		pressed: "false",
	};
	#color: ColorToolbarButtonState = {
		disabled: true,
		values: new Set(),
	};
	#fontFamily: FontFamilyToolbarButtonState = {
		disabled: true,
		values: new Set(),
	};
	#fontSize: FontSizeToolbarButtonState = {
		disabled: true,
		values: new Set(),
	};
	#indentation: IndentationToolbarButtonState = {
		disabled: true,
		values: new Set(),
	};
	#italic: ItalicToolbarButtonState = {
		disabled: true,
		pressed: "false",
	};
	#letterSpacing: LetterSpacingToolbarButtonState = {
		disabled: true,
		values: new Set(),
	};
	#lineHeight: LineHeightToolbarButtonState = {
		disabled: true,
		values: new Set(),
	};
	#lineLocalName: LineLocalNameToolbarButtonState = {
		disabled: true,
		values: new Set(),
	};
	#lineSpacing: LineSpacingToolbarButtonState = {
		disabled: true,
		values: new Set(),
	};
	#subscript: SubscriptToolbarButtonState = {
		disabled: true,
		pressed: "false",
	};
	#superscript: SuperscriptToolbarButtonState = {
		disabled: true,
		pressed: "false",
	};
	#strikethrough: StrikethroughToolbarButtonState = {
		disabled: true,
		pressed: "false",
	};
	#textAlign: TextAlignToolbarButtonState = {
		disabled: true,
		values: new Set(),
	};
	#underline: UnderlineToolbarButtonState = {
		disabled: true,
		pressed: "false",
	};

	#backgroundColorListeners: Set<UpdateBackgroundColorStateFn> = new Set();
	#boldListeners: Set<UpdateBoldStateFn> = new Set();
	#codeListeners: Set<UpdateCodeStateFn> = new Set();
	#colorListeners: Set<UpdateColorStateFn> = new Set();
	#fontFamilyListeners: Set<UpdateFontFamilyStateFn> = new Set();
	#fontSizeListeners: Set<UpdateFontSizeStateFn> = new Set();
	#indentationListeners: Set<UpdateIndentationStateFn> = new Set();
	#italicListeners: Set<UpdateItalicStateFn> = new Set();
	#letterSpacingListeners: Set<UpdateLetterSpacingStateFn> = new Set();
	#lineHeightListeners: Set<UpdateLineHeightStateFn> = new Set();
	#lineLocalNameListeners: Set<UpdateLineLocalNameStateFn> = new Set();
	#lineSpacingListeners: Set<UpdateLineSpacingStateFn> = new Set();
	#subscriptListeners: Set<UpdateSubscriptStateFn> = new Set();
	#superscriptListeners: Set<UpdateSuperscriptStateFn> = new Set();
	#strikethroughListeners: Set<UpdateStrikethroughStateFn> = new Set();
	#textAlignListeners: Set<UpdateTextAlignStateFn> = new Set();
	#underlineListeners: Set<UpdateUnderlineStateFn> = new Set();

	#stateChangeListeners: Set<StateChangeFn> = new Set();

	get backgroundColor() {
		return this.#backgroundColor;
	}

	get bold() {
		return this.#bold;
	}

	get code() {
		return this.#code;
	}

	get color() {
		return this.#color;
	}

	get fontFamily() {
		return this.#fontFamily;
	}

	get fontSize() {
		return this.#fontSize;
	}

	get indentation() {
		return this.#indentation;
	}

	get italic() {
		return this.#italic;
	}

	get letterSpacing() {
		return this.#letterSpacing;
	}

	get lineHeight() {
		return this.#lineHeight;
	}

	get lineLocalName() {
		return this.#lineLocalName;
	}

	get lineSpacing() {
		return this.#lineSpacing;
	}

	get subscript() {
		return this.#subscript;
	}

	get superscript() {
		return this.#superscript;
	}

	get strikethrough() {
		return this.#strikethrough;
	}

	get textAlign() {
		return this.#textAlign;
	}

	get underline() {
		return this.#underline;
	}

	#updateListener({ type, callback, operation }: UpdateListenerParams) {
		if (type === toolbarButtonsName.backgroundColor) {
			this.#backgroundColorListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.bold) {
			this.#boldListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.code) {
			this.#codeListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.color) {
			this.#colorListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.fontFamily) {
			this.#fontFamilyListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.fontSize) {
			this.#fontSizeListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.indentation) {
			this.#indentationListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.italic) {
			this.#italicListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.letterSpacing) {
			this.#letterSpacingListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.lineHeight) {
			this.#lineHeightListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.lineLocalName) {
			this.#lineLocalNameListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.lineSpacing) {
			return this.#lineSpacingListeners[operation](callback);
		}

		if (type === toolbarButtonsName.subscript) {
			this.#subscriptListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.superscript) {
			this.#superscriptListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.strikethrough) {
			this.#strikethroughListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.textAlign) {
			this.#textAlignListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.underline) {
			this.#underlineListeners[operation](callback);
			return;
		}

		if (type === "statechange") {
			this.#stateChangeListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: ListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: ListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	updateState({
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
	}: UpdateFormatStylesButtonsStateParams) {
		if (backgroundColor) {
			this.#backgroundColor = { ...this.#backgroundColor, ...backgroundColor };

			for (const listener of this.#backgroundColorListeners) {
				listener(this.#backgroundColor);
			}
		}

		if (bold) {
			this.#bold = { ...this.#bold, ...bold };

			for (const listener of this.#boldListeners) {
				listener(this.#bold);
			}
		}

		if (code) {
			this.#code = { ...this.#code, ...code };

			for (const listener of this.#codeListeners) {
				listener(this.#code);
			}
		}

		if (color) {
			this.#color = { ...this.#color, ...color };

			for (const listener of this.#colorListeners) {
				listener(this.#color);
			}
		}

		if (fontFamily) {
			this.#fontFamily = { ...this.#fontFamily, ...fontFamily };

			for (const listener of this.#fontFamilyListeners) {
				listener(this.#fontFamily);
			}
		}

		if (fontSize) {
			this.#fontSize = { ...this.#fontSize, ...fontSize };

			for (const listener of this.#fontSizeListeners) {
				listener(this.#fontSize);
			}
		}

		if (indentation) {
			this.#indentation = { ...this.#indentation, ...indentation };

			for (const listener of this.#indentationListeners) {
				listener(this.#indentation);
			}
		}

		if (italic) {
			this.#italic = { ...this.#italic, ...italic };

			for (const listener of this.#italicListeners) {
				listener(this.#italic);
			}
		}

		if (letterSpacing) {
			this.#letterSpacing = { ...this.#letterSpacing, ...letterSpacing };

			for (const listener of this.#letterSpacingListeners) {
				listener(this.#letterSpacing);
			}
		}

		if (lineHeight) {
			this.#lineHeight = { ...this.#lineHeight, ...lineHeight };

			for (const listener of this.#lineHeightListeners) {
				listener(this.#lineHeight);
			}
		}

		if (lineLocalName) {
			this.#lineLocalName = { ...this.#lineLocalName, ...lineLocalName };

			for (const listener of this.#lineLocalNameListeners) {
				listener(this.#lineLocalName);
			}
		}

		if (lineSpacing) {
			this.#lineSpacing = { ...this.#lineSpacing, ...lineSpacing };

			for (const listener of this.#lineSpacingListeners) {
				listener(this.#lineSpacing);
			}
		}

		if (subscript) {
			this.#subscript = { ...this.#subscript, ...subscript };

			for (const listener of this.#subscriptListeners) {
				listener(this.#subscript);
			}
		}

		if (superscript) {
			this.#superscript = { ...this.#superscript, ...superscript };

			for (const listener of this.#superscriptListeners) {
				listener(this.#superscript);
			}
		}

		if (strikethrough) {
			this.#strikethrough = { ...this.#strikethrough, ...strikethrough };

			for (const listener of this.#strikethroughListeners) {
				listener(this.#strikethrough);
			}
		}

		if (textAlign) {
			this.#textAlign = { ...this.#textAlign, ...textAlign };

			for (const listener of this.#textAlignListeners) {
				listener(this.#textAlign);
			}
		}

		if (underline) {
			this.#underline = { ...this.#underline, ...underline };

			for (const listener of this.#underlineListeners) {
				listener(this.#underline);
			}
		}

		for (const listener of this.#stateChangeListeners) {
			listener();
		}
	}
}
