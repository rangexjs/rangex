import {
	createContentLine,
	createFormattableTexts,
	EditorRange,
} from "rich-text-area";
import { getClosestScopedEditable } from "#engine-links";
import { assertNever } from "#utilities";
import { scanMarkdownChars } from "../_Utilities";
import type {
	CanApplyInlineTagParams,
	HandleInlineMarkdownParams,
	MatchInlineTriggerResult,
} from "./HandleInlineMarkdown-types";

// How far back a marker's opening half can sit from the closing keystroke — inline spans
// can hold several words, unlike the short fixed-length block triggers.
const maxScanChars = 200;

const boldPattern = /\*\*([^*\s](?:[^*]*[^*\s])?)\*\*$/;
const italicStarPattern = /(?<!\*)\*([^*\s](?:[^*]*[^*\s])?)\*$/;
const italicUnderscorePattern = /(?<!_)_([^_\s](?:[^_]*[^_\s])?)_$/;
const strikePattern = /~~([^~\s](?:[^~]*[^~\s])?)~~$/;
const codePattern = /`([^`\s](?:[^`]*[^`\s])?)`$/;

/**
 * Tries the pattern(s) that keystroke could possibly complete. "*" is shared between bold
 * ("**...**") and italic ("*...*") — bold is tried first since it's the more specific
 * (longer) marker; if the line doesn't end in a closed "**" pair, it falls back to italic.
 */
const matchInlineTrigger = (
	candidateText: string,
	triggerChar: "*" | "_" | "~" | "`",
): MatchInlineTriggerResult => {
	if (triggerChar === "*") {
		// Bold
		const bold = boldPattern.exec(candidateText);

		if (bold) {
			return { tag: "b", fullLength: bold[0].length, contentText: bold[1] };
		}

		// Italic
		const italic = italicStarPattern.exec(candidateText);

		if (italic) {
			return {
				tag: "i",
				fullLength: italic[0].length,
				contentText: italic[1],
			};
		}

		return null;
	}

	if (triggerChar === "_") {
		// Italic
		const italic = italicUnderscorePattern.exec(candidateText);

		if (!italic) {
			return null;
		}

		return { tag: "i", fullLength: italic[0].length, contentText: italic[1] };
	}

	if (triggerChar === "~") {
		// Strikethrough
		const strike = strikePattern.exec(candidateText);

		if (!strike) {
			return null;
		}

		return { tag: "s", fullLength: strike[0].length, contentText: strike[1] };
	}

	if (triggerChar === "`") {
		// Code
		const code = codePattern.exec(candidateText);

		if (!code) {
			return null;
		}

		return { tag: "code", fullLength: code[0].length, contentText: code[1] };
	}

	return assertNever(triggerChar);
};

const canApplyInlineTag = ({ editorAPI, tag }: CanApplyInlineTagParams) => {
	const selection = editorAPI.getEditorSelection();

	const { fromText } = selection.getBoundaryPoints();

	const scopedEditable = getClosestScopedEditable({ fromNode: fromText });

	if (!scopedEditable) {
		throw new Error("ScopedEditable not supposed to be null.");
	}

	const { $$allowedGlyphFormatterInlineTags } = scopedEditable;

	if (!$$allowedGlyphFormatterInlineTags) {
		return true;
	}

	return $$allowedGlyphFormatterInlineTags.includes(tag);
};

/*
 * Detects a completed inline markdown marker ("**bold**", "*italic*"/"_italic_",
 * "~~strike~~", "`code`") on the keystroke that closes it, and wraps the enclosed text in
 * the matching inline tag, letting the keystroke insert natively first so a single undo
 * can restore the literal text.
 */
export const handleInlineMarkdown = ({
	editorAPI,
}: HandleInlineMarkdownParams) => {
	const selection = editorAPI.getEditorSelection();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unregister = editorAPI.registerEventInterceptor({
		type: "beforeinput",
		interceptor: (event) => {
			if (
				event.data !== "*" &&
				event.data !== "_" &&
				event.data !== "~" &&
				event.data !== "`"
			) {
				return false;
			}

			const triggerChar = event.data;

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

			const candidateText = prefix.step.data + triggerChar;

			const match = matchInlineTrigger(candidateText, triggerChar);

			if (!match) {
				return false;
			}

			if (!canApplyInlineTag({ editorAPI, tag: match.tag })) {
				return false;
			}

			// Materialize the triggering keystroke so the full marker (e.g. "**bold**")
			// lands in the DOM before conversion — a single undo afterwards restores it.
			editorAPI.insertNode({
				fromNode: startText,
				fromOffset: startOffset,
				lines: [
					createContentLine({
						localName: "p",
						childNodes: [...createFormattableTexts({ data: triggerChar })],
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
					"handleInlineMarkdown: could not re-locate the marker span after inserting the trigger character.",
				);
				return true;
			}

			// Commit the completed marker as its own undo step before converting it.
			snapshotTimeline.registerSnapshotBoundary();
			editorAPI.flushEditorEvents();

			// Remove the whole matched span (both marker pairs + content) and reinsert
			// just the plain content text — simpler and safer than stripping the opening
			// and closing marker pairs independently.
			editorAPI.removeNodesInRange({
				fromNode: wholeSpan.step.toText,
				fromOffset: wholeSpan.step.toOffset,
				toNode: afterTriggerBoundary.fromText,
				toOffset: afterTriggerBoundary.fromOffset,
			});

			const contentInsertionBoundary = selection.getBoundaryPoints();

			editorAPI.insertNode({
				fromNode: contentInsertionBoundary.fromText,
				fromOffset: contentInsertionBoundary.fromOffset,
				lines: [
					createContentLine({
						localName: "p",
						childNodes: [
							...createFormattableTexts({ data: match.contentText }),
						],
					}),
				],
				breakBeforeInsert: false,
			});

			const contentEndBoundary = selection.getBoundaryPoints();

			const contentStart = scanMarkdownChars({
				editorAPI,
				fromText: contentEndBoundary.fromText,
				fromOffset: contentEndBoundary.fromOffset,
				maxChars: match.contentText.length,
			});

			if (
				!contentStart ||
				contentStart.charsScanned !== match.contentText.length
			) {
				console.warn(
					"handleInlineMarkdown: could not re-locate the reinserted content.",
				);
				editorAPI.focus();
				return true;
			}

			selection.setBoundaryPoints({
				fromNode: contentStart.step.toText,
				fromOffset: contentStart.step.toOffset,
				toNode: contentEndBoundary.fromText,
				toOffset: contentEndBoundary.fromOffset,
			});

			editorAPI.updateSelectionStyles({ inlineTags: { [match.tag]: true } });

			// updateSelectionStyles rewraps the text nodes it styles, so contentEndBoundary
			// is stale now — re-read the live selection instead.
			const afterStylesBoundary = selection.getBoundaryPoints();

			const afterStylesRange = new EditorRange({
				fromNode: afterStylesBoundary.fromText,
				fromOffset: afterStylesBoundary.fromOffset,
				toNode: afterStylesBoundary.toText,
				toOffset: afterStylesBoundary.toOffset,
			});

			// Collapse the cursor to the end of the newly formatted text.
			selection.setBoundaryPoints({
				fromNode: afterStylesRange.endText,
				fromOffset: afterStylesRange.endOffset,
				toNode: afterStylesRange.endText,
				toOffset: afterStylesRange.endOffset,
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
