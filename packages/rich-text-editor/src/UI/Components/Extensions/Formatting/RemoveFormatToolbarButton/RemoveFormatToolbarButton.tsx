import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type {
	FormattingIndentationState,
	FormattingIndentationValue,
	FormattingLineHeightState,
	FormattingLineHeightValue,
	FormattingLineSpacingState,
	FormattingLineSpacingValue,
	FormattingTextAlignState,
	FormattingTextAlignValue,
	FormattingUIPort,
} from "#adapters";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../_Utilities";

const checkHasIndentation = (
	indentation: FormattingIndentationState,
	defaultValue: FormattingIndentationValue,
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
	lineHeight: FormattingLineHeightState,
	defaultValue: FormattingLineHeightValue,
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
	lineSpacing: FormattingLineSpacingState,
	defaultValue: FormattingLineSpacingValue,
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
	textAlign: FormattingTextAlignState,
	defaultValue: FormattingTextAlignValue,
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

const isButtonDisabled = (uiPort: FormattingUIPort) => {
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
	} = uiPort;

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
		uiPort.defaultIndentation,
	);
	const hasLineHeight = checkHasLineHeight(
		lineHeight,
		uiPort.defaultLineHeight,
	);
	const hasLineSpacing = checkHasLineSpacing(
		lineSpacing,
		uiPort.defaultLineSpacing,
	);
	const hasTextAlign = checkHasTextAlign(textAlign, uiPort.defaultTextAlign);

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
	const { formattingUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!formattingUIPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [buttonDisabled, setButtonDisabled] = createSignal(
		isButtonDisabled(formattingUIPort),
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeFormatting = formattingUIPort.onAnyFieldUpdate(() => {
			setButtonDisabled(isButtonDisabled(formattingUIPort));
		});
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeFormatting();
			unsubscribeReadOnly?.();
		});
	});

	const onClick = () => {
		// Each toggle field is sent as "true" — not the value to set, but the
		// currently-applied state the Editor is being told to turn off. Toggle
		// fields in FormattingActionState always mean "this is on, flip it."
		formattingUIPort.emitFormattingChange({
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

	const disabled = createMemo(() => buttonDisabled() || readOnly());

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="TSlash" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
