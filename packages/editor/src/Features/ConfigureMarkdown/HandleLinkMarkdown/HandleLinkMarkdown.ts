import {
	createContentLine,
	createFormattableTexts,
	EditorRange,
} from "@rangex/core";
import { componentsName } from "#constants";
import {
	linkAttrsShape,
	normalizeLinkAttrs,
	validateComponentAttrs,
} from "#dom-attrs";
import { getClosestScopedEditable } from "#engine-links";
import { createLink } from "../../_Utilities";
import { scanMarkdownChars } from "../_Utilities";
import type {
	CanApplyLinkParams,
	HandleLinkMarkdownParams,
	MatchLinkTriggerResult,
} from "./HandleLinkMarkdown-types";

// URLs can run long, well past the fixed-length inline formatting markers.
const maxScanChars = 500;

// Checked before linkPattern — "![...](...)" is a strict subset of "[...](...)"'s shape,
// so link would otherwise also match on the "]" that's actually part of the media form.
const mediaPattern = /!\[([^\]]*)\]\(([^)\s]+)\)$/;
const linkPattern = /(?<!!)\[([^\]\s][^\]]*)\]\(([^)\s]+)\)$/;

const matchLinkTrigger = (candidateText: string): MatchLinkTriggerResult => {
	// Image / video / audio / embed — routed by URL, see the TODO in handleLinkMarkdown.
	const media = mediaPattern.exec(candidateText);

	if (media) {
		return {
			type: "media",
			fullLength: media[0].length,
			alt: media[1],
			url: media[2],
		};
	}

	// Link
	const link = linkPattern.exec(candidateText);

	if (!link) {
		return null;
	}

	return {
		type: "link",
		fullLength: link[0].length,
		text: link[1],
		url: link[2],
	};
};

const canApplyLink = ({ adapterBus, editorAPI }: CanApplyLinkParams) => {
	if (!adapterBus.hasAdapter("link")) {
		return false;
	}

	const selection = editorAPI.getEditorSelection();

	const { fromText } = selection.getBoundaryPoints();

	const scopedEditable = getClosestScopedEditable({ fromNode: fromText });

	if (!scopedEditable) {
		throw new Error("ScopedEditable not supposed to be null.");
	}

	const { $$allowedComponents } = scopedEditable;

	if (!$$allowedComponents) {
		return true;
	}

	return $$allowedComponents.includes(componentsName.link);
};

/*
 * Detects a completed "[text](url)" or "![alt](url)" marker on the closing ")" keystroke,
 * letting the keystroke insert natively first so a single undo can restore the literal text.
 */
export const handleLinkMarkdown = ({
	adapterBus,
	editorAPI,
}: HandleLinkMarkdownParams) => {
	const selection = editorAPI.getEditorSelection();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unregister = editorAPI.registerEventInterceptor({
		type: "beforeinput",
		interceptor: (event) => {
			if (event.data !== ")") {
				return false;
			}

			const beforeTriggerBoundary = selection.getBoundaryPoints();

			const range = new EditorRange({
				fromNode: beforeTriggerBoundary.fromText,
				fromOffset: beforeTriggerBoundary.fromOffset,
				toNode: beforeTriggerBoundary.toText,
				toOffset: beforeTriggerBoundary.toOffset,
			});

			if (!range.isSinglePoint) {
				return false;
			}

			const { startText, startOffset } = range;

			const prefix = scanMarkdownChars({
				editorAPI,
				fromText: startText,
				fromOffset: startOffset,
				maxChars: maxScanChars,
			});

			if (!prefix) {
				return false;
			}

			const candidateText = `${prefix.step.data})`;

			const match = matchLinkTrigger(candidateText);

			if (!match) {
				return false;
			}

			// TODO: media insertion (image/video/audio/embed, routed by URL/extension) isn't
			// wired up yet — detection works, but there's nowhere to send it. Leave the
			// keystroke alone for now so it just types literally.
			if (match.type === "media") {
				return false;
			}

			if (!canApplyLink({ adapterBus, editorAPI })) {
				return false;
			}

			const attrs = normalizeLinkAttrs({
				anchor: { href: match.url },
			});

			// An href the Link's attribute validators reject stays plain text
			const attrsMismatch = validateComponentAttrs({
				componentAttrs: attrs,
				componentAttrsShape: linkAttrsShape,
				componentAttrValidators: adapterBus.getAttrValidators("link"),
			});

			if (attrsMismatch) {
				return false;
			}

			// Materialize the triggering keystroke so the full marker (e.g.
			// "[text](url)") lands in the DOM before conversion — a single undo
			// afterwards restores it.
			editorAPI.insertNode({
				fromNode: startText,
				fromOffset: startOffset,
				lines: [
					createContentLine({
						localName: "p",
						childNodes: [...createFormattableTexts({ data: ")" })],
					}),
				],
				breakBeforeInsert: false,
			});

			const afterTriggerBoundary = selection.getBoundaryPoints();

			const wholeSpan = scanMarkdownChars({
				editorAPI,
				fromText: afterTriggerBoundary.fromText,
				fromOffset: afterTriggerBoundary.fromOffset,
				maxChars: match.fullLength,
			});

			if (!wholeSpan || wholeSpan.charsScanned !== match.fullLength) {
				console.warn(
					"handleLinkMarkdown: could not re-locate the marker span after inserting the trigger character.",
				);
				return true;
			}

			// Commit the completed marker as its own undo step before converting it.
			snapshotTimeline.registerSnapshotBoundary();
			editorAPI.flushEditorEvents();

			editorAPI.removeNodesInRange({
				fromNode: wholeSpan.step.toText,
				fromOffset: wholeSpan.step.toOffset,
				toNode: afterTriggerBoundary.fromText,
				toOffset: afterTriggerBoundary.fromOffset,
			});

			const insertionBoundary = selection.getBoundaryPoints();

			editorAPI.insertNode({
				fromNode: insertionBoundary.fromText,
				fromOffset: insertionBoundary.fromOffset,
				lines: [
					createContentLine({
						localName: "p",
						childNodes: [createLink({ text: match.text, attrs })],
					}),
				],
				breakBeforeInsert: false,
			});

			snapshotTimeline.registerSnapshotBoundary();

			editorAPI.focus();

			return true;
		},
	});

	return () => {
		unregister();
	};
};
