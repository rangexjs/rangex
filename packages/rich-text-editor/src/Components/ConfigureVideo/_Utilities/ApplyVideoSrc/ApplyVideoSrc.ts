import { getVideoElement } from "../GetVideoElements";
import type { ApplyVideoSrcParams } from "./ApplyVideoSrc-types";

/**
 * Updates `src` on a video that already has one — used by the swap popover's Update
 * action. Videos are never inserted empty (that's `media`'s job before it resolves), so
 * there's no placeholder-filling case to handle here.
 */
export const applyVideoSrc = ({
	figure,
	src,
	editorAPI,
}: ApplyVideoSrcParams) => {
	const video = getVideoElement({ figure });

	video.setAttribute("src", src);

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.registerSnapshotBoundary();
};
