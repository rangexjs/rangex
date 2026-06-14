import type {
	FontFamilyValue,
	FontSizeValue,
	IndentationValue,
	LineHeightValue,
	LineSpacingValue,
	TextAlignValue,
} from "../ToolbarButtonProps";
import type { UpdateStateParams } from "./ToolbarButtonDefaultValues-types";

export class ToolbarButtonDefaultValues {
	#fontFamily: FontFamilyValue = "Inter";
	#fontSize: FontSizeValue = { type: "px", value: 16 };
	#indentation: IndentationValue = { type: "px", value: 0 };
	#lineHeight: LineHeightValue = { type: "number", value: 1.5 };
	#lineSpacing: LineSpacingValue = { type: "px", value: 0 };
	#textAlign: TextAlignValue = "start";

	get fontFamily() {
		return this.#fontFamily;
	}

	get fontSize() {
		return this.#fontSize;
	}

	get indentation() {
		return this.#indentation;
	}

	get lineHeight() {
		return this.#lineHeight;
	}

	get lineSpacing() {
		return this.#lineSpacing;
	}

	get textAlign() {
		return this.#textAlign;
	}

	updateState({
		fontFamily,
		fontSize,
		indentation,
		lineHeight,
		lineSpacing,
		textAlign,
	}: UpdateStateParams) {
		if (fontFamily) {
			this.#fontFamily = fontFamily;
		}

		if (fontSize) {
			this.#fontSize = fontSize;
		}

		if (indentation) {
			this.#indentation = indentation;
		}

		if (lineHeight) {
			this.#lineHeight = lineHeight;
		}

		if (lineSpacing) {
			this.#lineSpacing = lineSpacing;
		}

		if (textAlign) {
			this.#textAlign = textAlign;
		}
	}
}
