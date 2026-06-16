import type { FormatHTMLParams } from "./FormatHTML-types";

/**
 * Elements that never have a closing tag or children, per the HTML spec.
 * `Element.outerHTML` doesn't carry this information, so it's hardcoded here.
 */
const voidElementNames = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
]);

const serializeNode = (node: Node, depth: number): string => {
	const indent = "\t".repeat(depth);

	if (node.nodeType === Node.TEXT_NODE) {
		const text = node.textContent?.trim();

		return text ? `${indent}${text}` : "";
	}

	if (!(node instanceof Element)) {
		throw new Error(`[formatHTML] Unexpected node type: ${node.nodeName}`);
	}

	const tagName = node.tagName.toLowerCase();

	const attributes = Array.from(node.attributes)
		.map(({ name, value }) => ` ${name}="${value}"`)
		.join("");

	const openTag = `<${tagName}${attributes}>`;

	if (voidElementNames.has(tagName)) {
		return `${indent}${openTag}`;
	}

	const closeTag = `</${tagName}>`;
	const childNodes = Array.from(node.childNodes);

	if (childNodes.length === 0) {
		return `${indent}${openTag}${closeTag}`;
	}

	const isTextOnly = childNodes.every(
		(child) => child.nodeType === Node.TEXT_NODE,
	);

	if (isTextOnly) {
		return `${indent}${openTag}${node.textContent?.trim() ?? ""}${closeTag}`;
	}

	const childLines = childNodes
		.map((child) => serializeNode(child, depth + 1))
		.filter((line) => line.length > 0)
		.join("\n");

	return `${indent}${openTag}\n${childLines}\n${indent}${closeTag}`;
};

/**
 * Pretty-print an element's outerHTML with one tag per line, indented by
 * nesting depth. `Element.outerHTML` produces no whitespace between nested
 * tags, which is unreadable once syntax-highlighted for display.
 */
export const formatHTML = ({ element }: FormatHTMLParams): string =>
	serializeNode(element, 0);
