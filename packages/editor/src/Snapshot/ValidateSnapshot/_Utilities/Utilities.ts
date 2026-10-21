import type { EditorNodeDraft } from "@rangex/core";
import { assertNever, formatJSONMismatch } from "#utilities";
import type {
	DescribeElementAttrsMismatchParams,
	DescribeJSONMismatchParams,
	FormatNodePathParams,
} from "./Utilities-types";

const maxValueLength = 64;

/*
 * Formats a value taken from a snapshot for a failure's reason: escaped like a JSON string and cut to 64 characters,
 * so the reason stays short and on one line whatever the snapshot contains.
 */
export const formatValue = (value: string) => {
	const cutValue = value.slice(0, maxValueLength);

	return JSON.stringify(cutValue);
};

/*
 * Formats one node of a node path: its editorRole, its localName when it has one, and its index among its parent's
 * childNodes, e.g. `html-layout(a)[0]`.
 */
const formatNodeSegment = (nodeDraft: EditorNodeDraft) => {
	const { editorRole, parentElement } = nodeDraft;

	let segment: string = editorRole;

	if ("localName" in nodeDraft) {
		segment += `(${nodeDraft.localName})`;
	}

	if (!parentElement) {
		return segment;
	}

	// TypeScript limitation
	const index = parentElement.childNodes.indexOf(nodeDraft as never);

	return `${segment}[${index}]`;
};

/*
 * Formats the path from a component down to one of its nodes for a failure's reason, e.g.
 * `link > html-layout(a)[0] > nested-editable[0]`. The component is named by its name, every other node by formatNodeSegment.
 */
export const formatNodePath = ({
	componentDraft,
	nodeDraft,
}: FormatNodePathParams) => {
	const segments: string[] = [];

	let currentDraft: EditorNodeDraft | null = nodeDraft;

	while (currentDraft && currentDraft !== componentDraft) {
		segments.unshift(formatNodeSegment(currentDraft));

		currentDraft = currentDraft.parentElement;
	}

	segments.unshift(componentDraft.name);

	return segments.join(" > ");
};

/*
 * Describes a matchJSON mismatch of a component's node for a failure's reason, e.g.
 * `link > html-layout(a)[0]: invalid value domAttrs.href: "javascript:alert(1)".` The value is the one passed to
 * matchJSON.
 */
export const describeJSONMismatch = ({
	componentDraft,
	nodeDraft,
	value,
	mismatch,
}: DescribeJSONMismatchParams) => {
	const { kind } = mismatch;

	const nodePath = formatNodePath({ componentDraft, nodeDraft });

	const formattedMismatch = formatJSONMismatch({ value, mismatch });

	if (kind === "invalid-value") {
		return `${nodePath}: invalid value ${formattedMismatch}.`;
	}

	if (kind === "unknown-key") {
		return `${nodePath}: unknown key ${formattedMismatch}.`;
	}

	if (kind === "missing-key") {
		return `${nodePath}: missing key ${formattedMismatch}.`;
	}

	return assertNever(kind);
};

/*
 * Describes a validateElementAttrs mismatch of a component's node for a failure's reason, e.g.
 * `link > html-layout(a)[0]: invalid value domAttrs.target: "_self" (must be "_blank").`
 */
export const describeElementAttrsMismatch = ({
	componentDraft,
	nodeDraft,
	domAttrs,
	mismatch,
}: DescribeElementAttrsMismatchParams) => {
	const { kind, attrName } = mismatch;

	const nodePath = formatNodePath({ componentDraft, nodeDraft });

	const value = { domAttrs };
	const path = ["domAttrs", attrName];

	if (kind === "unknown-attr") {
		const formattedMismatch = formatJSONMismatch({
			value,
			mismatch: { path, kind: "unknown-key" },
		});

		return `${nodePath}: unknown key ${formattedMismatch}.`;
	}

	if (kind === "missing-attr") {
		const formattedMismatch = formatJSONMismatch({
			value,
			mismatch: { path, kind: "missing-key" },
		});

		return `${nodePath}: missing key ${formattedMismatch}.`;
	}

	if (kind === "invalid-attr") {
		const formattedMismatch = formatJSONMismatch({
			value,
			mismatch: { path, kind: "invalid-value" },
		});

		return `${nodePath}: invalid value ${formattedMismatch} (${mismatch.validationFailed.reason}).`;
	}

	return assertNever(mismatch);
};
