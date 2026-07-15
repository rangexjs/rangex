import { getImageImg } from "../GetImageElements";
import type { ApplyImageSrcParams } from "./ApplyImageSrc-types";

/**
 * Updates `src` on an image that already has one — used by the swap popover's Update
 * action. Images are never inserted empty (that's `media`'s job before it resolves), so
 * there's no placeholder-filling case to handle here.
 */
export const applyImageSrc = ({
	figure,
	src,
	editorAPI,
}: ApplyImageSrcParams) => {
	const img = getImageImg({ figure });

	img.setAttribute("src", src);

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.registerSnapshotBoundary();
};
