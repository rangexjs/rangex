import {
	createContentLine,
	createFormattableTexts,
	EditorRange,
} from "rich-text-area";
import { componentsName, getClosestScopedEditable } from "#engine-links";
import { createSeparator } from "../../_Utilities";
import {
	getLineMarkdownPrefix,
	isPrefixAtContentLineStart,
} from "../_Utilities";
import type { HandleSeparatorMarkdownParams } from "./HandleSeparatorMarkdown-types";

/**
 * Detects "---", "***" or "___" on the 3rd identical character typed on an otherwise
 * empty line, and converts it to a Separator. Lets that keystroke insert natively first —
 * same as HandleBlockMarkdown — so the literal trigger text lands in the DOM before
 * conversion, and a single undo restores it.
 */
export const handleSeparatorMarkdown = ({
	editorAPI,
	blockComponentPlacement,
}: HandleSeparatorMarkdownParams) => {
	const selection = editorAPI.getEditorSelection();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unregister = editorAPI.registerEventInterceptor({
		type: "beforeinput",
		interceptor: (event) => {
			if (event.data !== "-" && event.data !== "*" && event.data !== "_") {
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

			const prefix = getLineMarkdownPrefix({
				editorAPI,
				fromText: startText,
				fromOffset: startOffset,
			});

			// Match only when the line so far is exactly the trigger char doubled (e.g.
			// "--" before this 3rd "-") — nothing else on the line, no mixed chars.
			if (!prefix || prefix.data !== triggerChar + triggerChar) {
				return false;
			}

			if (!isPrefixAtContentLineStart({ prefix })) {
				return false;
			}

			const scopedEditable = getClosestScopedEditable({ fromNode: startText });

			if (!scopedEditable) {
				throw new Error("ScopedEditable not supposed to be null.");
			}

			if (scopedEditable.$$display !== "block multi-line") {
				return false;
			}

			if (scopedEditable.$$allowedComponents) {
				const canInsert = blockComponentPlacement.canInsertBySelection({
					allowedComponents: [componentsName.separator],
				});

				if (!canInsert) {
					return false;
				}
			}

			// Materialize the triggering keystroke so the full marker (e.g. "---") lands
			// in the DOM before conversion — a single undo afterwards restores it.
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

			// The insert above updated the text nodes — re-scan for the removal boundary.
			const afterTriggerBoundary = selection.getBoundaryPoints();

			const fullPrefix = getLineMarkdownPrefix({
				editorAPI,
				fromText: afterTriggerBoundary.fromText,
				fromOffset: afterTriggerBoundary.fromOffset,
			});

			if (!fullPrefix) {
				console.warn(
					"handleSeparatorMarkdown: could not re-locate the line prefix after inserting the trigger character.",
				);
				return true;
			}

			// Commit the completed marker as its own undo step before converting it.
			snapshotTimeline.registerSnapshotBoundary();
			editorAPI.flushEditorEvents();

			editorAPI.removeNodesInRange({
				fromNode: fullPrefix.toText,
				fromOffset: fullPrefix.toOffset,
				toNode: afterTriggerBoundary.fromText,
				toOffset: afterTriggerBoundary.fromOffset,
			});

			const separatorLine = createSeparator();

			blockComponentPlacement.insertBySelection({
				lines: [separatorLine],
				shouldReplaceContentLineIfEmpty: true,
			});

			selection.setBoundaryPoints({
				fromNode: separatorLine,
				fromOffset: separatorLine.$$childNodes.length,
				toNode: separatorLine,
				toOffset: separatorLine.$$childNodes.length,
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
