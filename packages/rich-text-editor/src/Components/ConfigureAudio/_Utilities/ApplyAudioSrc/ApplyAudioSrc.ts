import { getAudioElement } from "../GetAudioElements";
import type { ApplyAudioSrcParams } from "./ApplyAudioSrc-types";

/**
 * Updates `src` on an audio that already has one — used by the swap popover's Update
 * action. Audio is never inserted empty (that's `media`'s job before it resolves), so
 * there's no placeholder-filling case to handle here.
 */
export const applyAudioSrc = ({
	figure,
	src,
	editorAPI,
}: ApplyAudioSrcParams) => {
	const audio = getAudioElement({ figure });

	audio.setAttribute("src", src);

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.registerSnapshotBoundary();
};
