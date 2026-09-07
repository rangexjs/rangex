import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveFormattingPort,
	ReactiveFormattingResult,
} from "./Formatting-types";

export const Formatting = (
	publicPort: FormattingPublicPort,
): ReactiveFormattingResult => {
	const [backgroundColor, setBackgroundColor] = createSignal(
		publicPort.backgroundColor,
	);
	const [bold, setBold] = createSignal(publicPort.bold);
	const [code, setCode] = createSignal(publicPort.code);
	const [color, setColor] = createSignal(publicPort.color);
	const [fontFamily, setFontFamily] = createSignal(publicPort.fontFamily);
	const [fontSize, setFontSize] = createSignal(publicPort.fontSize);
	const [indentation, setIndentation] = createSignal(publicPort.indentation);
	const [italic, setItalic] = createSignal(publicPort.italic);
	const [letterSpacing, setLetterSpacing] = createSignal(
		publicPort.letterSpacing,
	);
	const [lineHeight, setLineHeight] = createSignal(publicPort.lineHeight);
	const [lineLocalName, setLineLocalName] = createSignal(
		publicPort.lineLocalName,
	);
	const [lineSpacing, setLineSpacing] = createSignal(publicPort.lineSpacing);
	const [subscript, setSubscript] = createSignal(publicPort.subscript);
	const [superscript, setSuperscript] = createSignal(publicPort.superscript);
	const [strikethrough, setStrikethrough] = createSignal(
		publicPort.strikethrough,
	);
	const [textAlign, setTextAlign] = createSignal(publicPort.textAlign);
	const [underline, setUnderline] = createSignal(publicPort.underline);
	const [removeLine, setRemoveLine] = createSignal(publicPort.removeLine);
	const [removeText, setRemoveText] = createSignal(publicPort.removeText);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onBackgroundColorUpdate(setBackgroundColor));
	unsubscribeList.add(publicPort.onBoldUpdate(setBold));
	unsubscribeList.add(publicPort.onCodeUpdate(setCode));
	unsubscribeList.add(publicPort.onColorUpdate(setColor));
	unsubscribeList.add(publicPort.onFontFamilyUpdate(setFontFamily));
	unsubscribeList.add(publicPort.onFontSizeUpdate(setFontSize));
	unsubscribeList.add(publicPort.onIndentationUpdate(setIndentation));
	unsubscribeList.add(publicPort.onItalicUpdate(setItalic));
	unsubscribeList.add(publicPort.onLetterSpacingUpdate(setLetterSpacing));
	unsubscribeList.add(publicPort.onLineHeightUpdate(setLineHeight));
	unsubscribeList.add(publicPort.onLineLocalNameUpdate(setLineLocalName));
	unsubscribeList.add(publicPort.onLineSpacingUpdate(setLineSpacing));
	unsubscribeList.add(publicPort.onSubscriptUpdate(setSubscript));
	unsubscribeList.add(publicPort.onSuperscriptUpdate(setSuperscript));
	unsubscribeList.add(publicPort.onStrikethroughUpdate(setStrikethrough));
	unsubscribeList.add(publicPort.onTextAlignUpdate(setTextAlign));
	unsubscribeList.add(publicPort.onUnderlineUpdate(setUnderline));
	unsubscribeList.add(publicPort.onRemoveLineUpdate(setRemoveLine));
	unsubscribeList.add(publicPort.onRemoveTextUpdate(setRemoveText));

	const port: ReactiveFormattingPort = {
		raw: publicPort,

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
		removeLine,
		removeText,

		defaultFontFamily: publicPort.defaultFontFamily,
		defaultFontSize: publicPort.defaultFontSize,
		defaultIndentation: publicPort.defaultIndentation,
		defaultLineHeight: publicPort.defaultLineHeight,
		defaultLineSpacing: publicPort.defaultLineSpacing,
		defaultTextAlign: publicPort.defaultTextAlign,
		fontFamilyOptions: publicPort.fontFamilyOptions,

		setBackgroundColor: publicPort.setBackgroundColor,
		toggleBold: publicPort.toggleBold,
		toggleCode: publicPort.toggleCode,
		setColor: publicPort.setColor,
		setFontFamily: publicPort.setFontFamily,
		setFontSize: publicPort.setFontSize,
		setIndentation: publicPort.setIndentation,
		toggleItalic: publicPort.toggleItalic,
		setLetterSpacing: publicPort.setLetterSpacing,
		setLineHeight: publicPort.setLineHeight,
		setLineLocalName: publicPort.setLineLocalName,
		setLineSpacing: publicPort.setLineSpacing,
		toggleSubscript: publicPort.toggleSubscript,
		toggleSuperscript: publicPort.toggleSuperscript,
		toggleStrikethrough: publicPort.toggleStrikethrough,
		setTextAlign: publicPort.setTextAlign,
		toggleUnderline: publicPort.toggleUnderline,
		removeLineFormat: publicPort.removeLineFormat,
		removeTextFormat: publicPort.removeTextFormat,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
