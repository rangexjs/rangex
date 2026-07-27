import type {
	HandleLinkUnwrapParams,
	OnUnwrapCallback,
} from "./HandleLinkUnwrap-types";

export const handleLinkUnwrap = ({
	editorPort,
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

	const unsubscribe = editorPort.onUnwrap(callback);

	return () => {
		unsubscribe();
	};
};
