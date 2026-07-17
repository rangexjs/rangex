import type { FormatHTMLParams } from "./FormatHTML-types";

/**
 * Elements whose text content must be preserved verbatim — formatting their
 * children would corrupt the CSS or JS inside them.
 */
const rawContentElements = new Set(["style", "script"]);

/**
 * Standard block-level elements. When none of an element's direct children
 * are in this set, the element's content is emitted via innerHTML so that
 * inline elements and text nodes stay on one line instead of being split and
 * trimmed.
 */
const blockElementNames = new Set([
	"address",
	"article",
	"aside",
	"blockquote",
	"dd",
	"details",
	"dialog",
	"div",
	"dl",
	"dt",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"hgroup",
	"li",
	"main",
	"nav",
	"ol",
	"p",
	"pre",
	"section",
	"summary",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"tr",
	"ul",
]);

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

	if (rawContentElements.has(tagName)) {
		const content = node.textContent?.trim() ?? "";
		if (!content) {
			return `${indent}${openTag}${closeTag}`;
		}
		return `${indent}${openTag}\n${content}\n${indent}${closeTag}`;
	}

	if (node.childNodes.length === 0) {
		return `${indent}${openTag}${closeTag}`;
	}

	const hasBlockChild = Array.from(node.children).some((child) =>
		blockElementNames.has(child.tagName.toLowerCase()),
	);

	if (!hasBlockChild) {
		return `${indent}${openTag}${node.innerHTML}${closeTag}`;
	}

	const childLines = Array.from(node.childNodes)
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
