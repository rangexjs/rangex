import { type EditorNodeDraft, isComponentDraft } from "@rangex/core";
import { assertNever, formatJSONMismatch } from "#utilities";
import type {
	DescribeElementAttrsMismatchParams,
	DescribeJSONMismatchParams,
	FormatNodePathParams,
	FormatNodeSegmentParams,
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
 * Formats one node of a node path: its editorRole, its name when it's a component or its localName when it has one,
 * and its index among its parent's childNodes, e.g. `html-layout(a)[0]` or `block-component<image>[1]`. The path's root
 * has no index.
 */
const formatNodeSegment = ({
	rootDraft,
	nodeDraft,
}: FormatNodeSegmentParams) => {
	const { editorRole, parentElement } = nodeDraft;

	let segment: string = editorRole;

	if (isComponentDraft(nodeDraft)) {
		segment += `<${nodeDraft.name}>`;
	}

	if ("localName" in nodeDraft) {
		segment += `(${nodeDraft.localName})`;
	}

	if (nodeDraft === rootDraft || !parentElement) {
		return segment;
	}

	// TypeScript limitation
	const index = parentElement.childNodes.indexOf(nodeDraft as never);

	return `${segment}[${index}]`;
};

/*
 * Formats the path from a root (e.g. a component) down to one of its nodes for a failure's reason, e.g.
 * `inline-component<link> > html-layout(a)[0] > nested-editable[0]`. Every node is formatted by formatNodeSegment.
 */
export const formatNodePath = ({
	rootDraft,
	nodeDraft,
}: FormatNodePathParams) => {
	const segments: string[] = [];

	let currentDraft: EditorNodeDraft | null = nodeDraft;

	while (currentDraft && currentDraft !== rootDraft) {
		segments.unshift(formatNodeSegment({ rootDraft, nodeDraft: currentDraft }));

		currentDraft = currentDraft.parentElement;
	}

	segments.unshift(formatNodeSegment({ rootDraft, nodeDraft: rootDraft }));

	return segments.join(" > ");
};

/*
 * Describes a matchJSON mismatch of a node for a failure's reason, e.g.
 * `inline-component<link> > html-layout(a)[0]: invalid value localName: "span".` The value is the one passed to
 * matchJSON.
 */
export const describeJSONMismatch = ({
	rootDraft,
	nodeDraft,
	value,
	mismatch,
}: DescribeJSONMismatchParams) => {
	const { kind } = mismatch;

	const nodePath = formatNodePath({ rootDraft, nodeDraft });

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
 * Describes an ElementAttrsMismatch of a node for a failure's reason, e.g.
 * `inline-component<link> > html-layout(a)[0]: invalid value domAttrs.href: "javascript:alert(1)" (must be allowed by the
 * SanitizerPolicy).`
 */
export const describeElementAttrsMismatch = ({
	rootDraft,
	nodeDraft,
	domAttrs,
	mismatch,
}: DescribeElementAttrsMismatchParams) => {
	const { kind, attrName } = mismatch;

	const nodePath = formatNodePath({ rootDraft, nodeDraft });

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
