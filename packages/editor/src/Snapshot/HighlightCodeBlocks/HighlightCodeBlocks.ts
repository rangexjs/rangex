import {
	contentLineAttrName,
	contentLineRole,
	type ElementView,
	type NodeView,
	type TextView,
} from "rich-text-area";
import { isCodeBlockStorage } from "#storage";
import type {
	CreateTokenViewParams,
	GetContentLinesParams,
	GetContentLinesResult,
	GetLineTextParams,
	GetLineTextResult,
	HighlightCodeBlockParams,
	HighlightCodeBlocksParams,
	SetStylePropertiesParams,
} from "./HighlightCodeBlocks-types";

const isTextView = (nodeView: NodeView): nodeView is TextView => {
	return nodeView.type === "text";
};

/*
 * Collects the code block's ContentLines in document order, one per code line.
 */
const getContentLines = ({
	elementView,
}: GetContentLinesParams): GetContentLinesResult => {
	const contentLines: ElementView[] = [];

	for (const childView of elementView.childNodes) {
		if (childView.type !== "element") {
			continue;
		}

		const role = childView.attributes[contentLineAttrName.dataEditorRole];

		if (role === contentLineRole) {
			contentLines.push(childView);
			continue;
		}

		const nestedContentLines = getContentLines({ elementView: childView });
		contentLines.push(...nestedContentLines);
	}

	return contentLines;
};

const getLineText = ({ contentLine }: GetLineTextParams): GetLineTextResult => {
	const textViews = contentLine.childNodes.filter(isTextView);
	const texts = textViews.map((textView) => textView.data);

	return texts.join("");
};

/*
 * Wraps a token's text in a span colored for both color schemes. Falls back to the inherited color for a scheme the
 * theme leaves uncolored.
 */
const createTokenView = ({ themedChars }: CreateTokenViewParams) => {
	const { colors, content } = themedChars;

	const light = colors.light || "currentcolor";
	const dark = colors.dark || "currentcolor";

	const textView: TextView = {
		customStorage: null,
		type: "text",
		data: content,
	};

	const tokenView: ElementView = {
		customStorage: null,
		type: "element",
		localName: "span",
		attributes: { style: `color: light-dark(${light}, ${dark});` },
		childNodes: [textView],
	};

	return tokenView;
};

/*
 * Sets the given properties in the element's inline style, replacing earlier values of the same properties and
 * keeping every other declaration.
 */
const setStyleProperties = ({
	elementView,
	properties,
}: SetStylePropertiesParams) => {
	const { attributes } = elementView;

	const currentStyle = attributes.style ?? "";
	const currentDeclarations = currentStyle.split(";");

	const keptDeclarations = currentDeclarations.filter((declaration) => {
		const [name] = declaration.split(":");
		const trimmedName = name.trim();

		return trimmedName !== "" && !Object.hasOwn(properties, trimmedName);
	});

	const propertyEntries = Object.entries(properties);
	const newDeclarations = propertyEntries.map(
		([name, value]) => `${name}: ${value}`,
	);

	const declarations = [...keptDeclarations, ...newDeclarations];
	const trimmedDeclarations = declarations.map((declaration) =>
		declaration.trim(),
	);

	attributes.style = `${trimmedDeclarations.join("; ")};`;
};

/*
 * Replaces the text of each code line with colored token spans and sets the theme colors on the code block. Lines
 * holding anything other than text are left as they are.
 */
const highlightCodeBlock = ({
	elementView,
	codeBlockStorage,
	highlightCode,
}: HighlightCodeBlockParams) => {
	const { language, theme } = codeBlockStorage;

	if (language === null || theme === null) {
		return;
	}

	const contentLines = getContentLines({ elementView });
	const lines = contentLines.map((contentLine) => getLineText({ contentLine }));

	const highlightInfo = highlightCode({ lines, language, theme });

	if (!highlightInfo) {
		return;
	}

	const { backgrounds, foregrounds, codeLines } = highlightInfo;

	setStyleProperties({
		elementView,
		properties: {
			"--bg-light": backgrounds.light,
			"--bg-dark": backgrounds.dark,
			"--fg-light": foregrounds.light,
			"--fg-dark": foregrounds.dark,
		},
	});

	for (let i = 0; i < contentLines.length; i++) {
		const contentLine = contentLines[i];
		const codeLine = codeLines[i];

		const isTextOnly = contentLine.childNodes.every(isTextView);

		if (!(codeLine && codeLine.length > 0 && isTextOnly)) {
			continue;
		}

		contentLine.childNodes = codeLine.map((themedChars) =>
			createTokenView({ themedChars }),
		);
	}
};

/*
 * Applies syntax highlighting to every code block in the view tree, in place, so the tree can then be rendered to
 * HTML as usual.
 */
export const highlightCodeBlocks = ({
	nodeView,
	highlightCode,
}: HighlightCodeBlocksParams) => {
	if (nodeView.type !== "element") {
		return;
	}

	const { customStorage } = nodeView;

	if (isCodeBlockStorage(customStorage)) {
		highlightCodeBlock({
			elementView: nodeView,
			codeBlockStorage: customStorage,
			highlightCode,
		});
		return;
	}

	for (const childView of nodeView.childNodes) {
		highlightCodeBlocks({ nodeView: childView, highlightCode });
	}
};
