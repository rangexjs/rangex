import type {
	HandleLinkUnwrapParams,
	OnRemoveCallback,
} from "./HandleLinkUnwrap-types";

export const handleLinkUnwrap = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleLinkUnwrapParams) => {
	const { linkPopover } = richTextEditorUI;

	const callback: OnRemoveCallback = () => {
		const { currentLink } = internals;

		if (!currentLink) {
			console.warn("Link wasn't assigned.");
			return;
		}

		currentLink.$$unwrap();

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		internals.currentLink = null;

		editorAPI.focus();
	};

	linkPopover.onRemove(callback);
};
