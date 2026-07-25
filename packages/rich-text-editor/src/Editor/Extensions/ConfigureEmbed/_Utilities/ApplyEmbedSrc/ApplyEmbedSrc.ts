import { getEmbedIframe } from "../GetEmbedElements";
import type { ApplyEmbedSrcParams } from "./ApplyEmbedSrc-types";

/**
 * Updates `src` on an embed that already has one — used by the swap popover's Update
 * action. Embeds are never inserted empty (that's `media`'s job before it resolves), so
 * there's no placeholder-filling case to handle here.
 */
export const applyEmbedSrc = ({
	figure,
	src,
	editorAPI,
}: ApplyEmbedSrcParams) => {
	const iframe = getEmbedIframe({ figure });

	iframe.setAttribute("src", src);

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.registerSnapshotBoundary();
};
