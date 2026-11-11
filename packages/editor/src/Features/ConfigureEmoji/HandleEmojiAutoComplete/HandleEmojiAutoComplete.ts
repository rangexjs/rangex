import { createContentLine, createFormattableTexts, EditorRange } from "@rangex/core";

import { getEmojiQuery } from "../_Utilities";
import type { HandleEmojiAutoCompleteParams } from "./HandleEmojiAutoComplete-types";

/*
 * Intercepts the closing ':' keystroke and, when the text immediately before the cursor forms a
 * completed :name: shortcode matching a known emoji, replaces the shortcode with that emoji.
 */
export const handleEmojiAutoComplete = ({
	configPort,
	editorAPI,
}: HandleEmojiAutoCompleteParams) => {
	const selection = editorAPI.getEditorSelection();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unregister = editorAPI.registerEventInterceptor({
		type: "beforeinput",
		interceptor: (event) => {
			if (event.data !== ":") {
				return false;
			}

			const preColonBoundary = selection.getBoundaryPoints();

			const range = new EditorRange({
				fromNode: preColonBoundary.fromText,
				fromOffset: preColonBoundary.fromOffset,
				toNode: preColonBoundary.toText,
				toOffset: preColonBoundary.toOffset,
			});

			if (!range.isSinglePoint) {
				return false;
			}

			const { startText, startOffset } = range;

			const emojiQuery = getEmojiQuery({
				editorAPI,
				fromText: startText,
				fromOffset: startOffset,
				hasClosingColon: false,
			});

			if (!emojiQuery) {
				return false;
			}

			const match = configPort.findByName(emojiQuery.query);

			if (!match) {
				return false;
			}

			// Materialize the closing ':' so the full shortcode (e.g. ":sob:") is what
			// a single undo later restores.
			editorAPI.insertNode({
				fromNode: startText,
				fromOffset: startOffset,
				lines: [
					createContentLine({
						localName: "p",
						childNodes: [...createFormattableTexts({ data: ":" })],
					}),
				],
				breakBeforeInsert: false,
			});

			// `emojiQuery`'s boundary points are stale after the insert above — re-scan.
			const postColonBoundary = selection.getBoundaryPoints();

			const closedEmojiQuery = getEmojiQuery({
				editorAPI,
				fromText: postColonBoundary.fromText,
				fromOffset: postColonBoundary.fromOffset,
				hasClosingColon: true,
			});

			if (!closedEmojiQuery) {
				console.warn(
					"handleEmojiAutoComplete: could not re-locate the :name: shortcode after inserting ':'.",
				);
				return true;
			}

			// Commit the completed shortcode as its own undo step before converting it.
			snapshotTimeline.registerSnapshotBoundary();
			editorAPI.flushEditorEvents();

			// Remove the whole :<name>: trigger text
			editorAPI.removeNodesInRange({
				fromNode: postColonBoundary.fromText,
				fromOffset: postColonBoundary.fromOffset,
				toNode: closedEmojiQuery.toText,
				toOffset: closedEmojiQuery.toOffset,
			});

			// Re-read cursor after removal, then insert the emoji character
			const postRemovalBoundary = selection.getBoundaryPoints();

			editorAPI.insertNode({
				fromNode: postRemovalBoundary.fromText,
				fromOffset: postRemovalBoundary.fromOffset,
				lines: [
					createContentLine({
						localName: "p",
						childNodes: [...createFormattableTexts({ data: match.emoji })],
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
