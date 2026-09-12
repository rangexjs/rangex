import {
	contentLineName,
	contentLineRoleSelector,
	createContentLine,
	createFormattableTexts,
} from "rich-text-area";
import type {
	HandleLinkModificationParams,
	OnModifyCallback,
} from "./HandleLinkModification-types";

/**
 * Registers the modify callback, updates the link's content in-place, then syncs the popover
 * state to match what was actually persisted.
 */
export const handleLinkModification = ({
	configPort,
	editorAPI,
}: HandleLinkModificationParams) => {
	const selection = editorAPI.getEditorSelection();

	const callback: OnModifyCallback = ({ text }) => {
		const { currentComponent } = configPort;

		if (!currentComponent) {
			console.warn("handleLinkModification: no link is currently open.");
			return;
		}

		const contentLine = currentComponent.$$querySelector(
			contentLineRoleSelector,
		);

		if (contentLine?.$$editorRole !== contentLineName) {
			throw new Error("Link is missing its ContentLine.");
		}

		const createdContentLine = createContentLine({
			localName: "span",
			childNodes: [...createFormattableTexts({ data: text })],
		});

		contentLine.$$replaceWith(createdContentLine);

		selection.setBoundaryPoints({
			fromNode: createdContentLine,
			fromOffset: createdContentLine.$$childNodes.length,
			toNode: createdContentLine,
			toOffset: createdContentLine.$$childNodes.length,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	};

	const unsubscribe = configPort.onModify(callback);

	return () => {
		unsubscribe();
	};
};
