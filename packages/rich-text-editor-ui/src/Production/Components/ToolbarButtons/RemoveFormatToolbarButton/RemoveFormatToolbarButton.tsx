import { createSignal } from "solid-js";
import type { ToolbarButtonDefaultValues } from "../../../ToolbarButtonDefaultValues";
import type {
	IndentationToolbarButtonState,
	IndentationValue,
	LineHeightToolbarButtonState,
	LineHeightValue,
	LineSpacingToolbarButtonState,
	LineSpacingValue,
	TextAlignToolbarButtonState,
	TextAlignValue,
} from "../../../ToolbarButtonProps";
import type { FormatStylesButtonsStateManager } from "../../../ToolbarButtonsStateManager";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

const checkHasIndentation = (
	indentation: IndentationToolbarButtonState,
	defaultValue: IndentationValue,
) => {
	if (indentation.values.size > 1) {
		return true;
	}

	const { value } = indentation.values.values().next();

	if (!value) {
		return false;
	}

	return !(
		value.type === defaultValue.type && value.value === defaultValue.value
	);
};

const checkHasLineHeight = (
	lineHeight: LineHeightToolbarButtonState,
	defaultValue: LineHeightValue,
) => {
	if (lineHeight.values.size > 1) {
		return true;
	}

	const { value } = lineHeight.values.values().next();

	if (!value) {
		return false;
	}

	return !(
		value.type === defaultValue.type && value.value === defaultValue.value
	);
};

const checkHasLineSpacing = (
	lineSpacing: LineSpacingToolbarButtonState,
	defaultValue: LineSpacingValue,
) => {
	if (lineSpacing.values.size > 1) {
		return true;
	}

	const { value } = lineSpacing.values.values().next();

	if (!value) {
		return false;
	}

	return !(
		value.type === defaultValue.type && value.value === defaultValue.value
	);
};

const checkHasTextAlign = (
	textAlign: TextAlignToolbarButtonState,
	defaultValue: TextAlignValue,
) => {
	if (textAlign.values.size > 1) {
		return true;
	}

	const { value } = textAlign.values.values().next();

	if (!value) {
		return false;
	}

	return value !== defaultValue;
};

const isButtonDisabled = (
	stateManager: FormatStylesButtonsStateManager,
	defaultValues: ToolbarButtonDefaultValues,
) => {
	const {
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
		lineSpacing,
		strikethrough,
		subscript,
		superscript,
		textAlign,
		underline,
	} = stateManager;

	const hasBackgroundColor = backgroundColor.values.size > 0;
	const hasBold = bold.pressed !== "false";
	const hasCode = code.pressed !== "false";
	const hasColor = color.values.size > 0;
	const hasFontFamily = fontFamily.values.size > 0;
	const hasFontSize = fontSize.values.size > 0;
	const hasItalic = italic.pressed !== "false";
	const hasLetterSpacing = letterSpacing.values.size > 1;
	const hasStrikethrough = strikethrough.pressed !== "false";
	const hasSubscript = subscript.pressed !== "false";
	const hasSuperscript = superscript.pressed !== "false";
	const hasUnderline = underline.pressed !== "false";

	const hasIndentation = checkHasIndentation(
		indentation,
		defaultValues.indentation,
	);
	const hasLineHeight = checkHasLineHeight(
		lineHeight,
		defaultValues.lineHeight,
	);
	const hasLineSpacing = checkHasLineSpacing(
		lineSpacing,
		defaultValues.lineSpacing,
	);
	const hasTextAlign = checkHasTextAlign(textAlign, defaultValues.textAlign);

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
		hasUnderline ||
		hasIndentation ||
		hasLineHeight ||
		hasLineSpacing ||
		hasTextAlign
	);
};

export const RemoveFormatToolbarButton = () => {
	const {
		formatStylesButtonsStateManager,
		toolbarButtonDefaultValues,
		toolbarButtonsActionManager,
	} = useToolbarButtonManagersContext();

	const [disabled, setDisabled] = createSignal(
		isButtonDisabled(
			formatStylesButtonsStateManager,
			toolbarButtonDefaultValues,
		),
	);

	formatStylesButtonsStateManager.subscribe({
		type: "statechange",
		callback: () => {
			setDisabled(
				isButtonDisabled(
					formatStylesButtonsStateManager,
					toolbarButtonDefaultValues,
				),
			);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitFormatStylesChange({
			backgroundColor: null,
			bold: "true",
			code: "true",
			color: null,
			fontFamily: null,
			fontSize: null,
			indentation: { type: "px", value: 0 },
			italic: "true",
			letterSpacing: null,
			lineHeight: { type: "number", value: 1.5 },
			lineSpacing: { type: "px", value: 0 },
			strikethrough: "true",
			subscript: "true",
			superscript: "true",
			textAlign: "start",
			underline: "true",
		});
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="TSlash" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
