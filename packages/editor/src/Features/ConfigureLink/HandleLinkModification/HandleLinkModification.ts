import {
	contentLineName,
	contentLineRoleSelector,
	createContentLine,
	createFormattableTexts,
} from "rich-text-area";
import { getStateFromLink } from "../_Utilities";
import type {
	HandleLinkModificationParams,
	OnModifyCallback,
} from "./HandleLinkModification-types";

/**
 * Registers the modify callback, updates the link's attributes and content in-place, then syncs
 * the popover state to match what was actually persisted.
 */
export const handleLinkModification = ({
	configPort,
	editorAPI,
	internals,
}: HandleLinkModificationParams) => {
	const selection = editorAPI.getEditorSelection();

	const callback: OnModifyCallback = ({ text, url, isNewTab }) => {
		if (!internals.currentLink) {
			console.warn("handleLinkModification: no link is currently open.");
			return;
		}

		const { currentLink } = internals;

		const anchorElement = currentLink.$$querySelector("a");

		if (!(anchorElement instanceof HTMLAnchorElement)) {
			throw new Error("Link is missing its anchor element.");
		}

		const contentLine = currentLink.$$querySelector(contentLineRoleSelector);

		if (contentLine?.$$editorRole !== contentLineName) {
			throw new Error("Link is missing its ContentLine.");
		}

		const target = isNewTab ? "_blank" : "_self";
		anchorElement.setAttribute("href", url);
		anchorElement.setAttribute("target", target);

		const createdContentLine = createContentLine({
			localName: "span",
			childNodes: [...createFormattableTexts({ data: text })],
		});

		contentLine.$$replaceWith(createdContentLine);

		const state = getStateFromLink({ editorAPI, link: currentLink });

		configPort.updateState(state);

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
