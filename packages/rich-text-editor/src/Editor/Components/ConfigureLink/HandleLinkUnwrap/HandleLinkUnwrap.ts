import type {
	HandleLinkUnwrapParams,
	OnUnwrapCallback,
} from "./HandleLinkUnwrap-types";

export const handleLinkUnwrap = ({
	linkPort,
	editorAPI,
	internals,
}: HandleLinkUnwrapParams) => {
	const callback: OnUnwrapCallback = () => {
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

	const unsubscribe = linkPort.onUnwrap(callback);

	return () => {
		unsubscribe();
	};
};
