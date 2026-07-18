import {
	contentLineName,
	contentLineRoleSelector,
	createContentLine,
	createFormattableTexts,
} from "rich-text-area";
import { getPopoverStateFromLink } from "../_Utilities";
import type {
	HandleLinkModificationParams,
	OnModifyCallback,
} from "./HandleLinkModification-types";

/**
 * Registers the modify callback, updates the link's attributes and content in-place, then syncs the popover state.
 */
export const handleLinkModification = ({
	linkPort,
	editorAPI,
	internals,
}: HandleLinkModificationParams) => {
	const selection = editorAPI.getEditorSelection();

	const callback: OnModifyCallback = ({ text, url, isNewTab }) => {
		if (!internals.currentLink) {
			console.warn("Link should have been assigned.");
			return;
		}

		const { currentLink } = internals;

		const anchor = currentLink.$$querySelector("a");

		if (!(anchor instanceof HTMLAnchorElement)) {
			throw new Error("Anchor's type is invalid.");
		}

		const contentLine = currentLink.$$querySelector(contentLineRoleSelector);

		if (contentLine?.$$editorRole !== contentLineName) {
			throw new Error("ContentLine's type is invalid.");
		}

		const target = isNewTab ? "_blank" : "_self";
		anchor.setAttribute("href", url);
		anchor.setAttribute("target", target);

		const createdContentLine = createContentLine({
			localName: "span",
			childNodes: [...createFormattableTexts({ data: text })],
		});

		contentLine.$$replaceWith(createdContentLine);

		const popoverState = getPopoverStateFromLink({
			editorAPI,
			link: currentLink,
		});

		linkPort.updateState(popoverState);

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

	const unsubscribe = linkPort.onModify(callback);

	return () => {
		unsubscribe();
	};
};
