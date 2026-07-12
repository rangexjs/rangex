import { createHTMLLayout } from "rich-text-area";
import {
	imageAspectRatioAttr,
	imageObjectFitAttr,
} from "../../../../Constants";
import { getImageDropzone, getImageImg } from "../GetImageElements";
import type { ApplyImageSrcParams } from "./ApplyImageSrc-types";

/**
 * Fills the empty placeholder on first use (replacing the dropzone with a real `img`), or
 * just updates `src` on an already-filled image. Shared by every trigger that can provide
 * a source — the swap popover's Update action and a direct file drop onto the dropzone.
 */
export const applyImageSrc = ({
	figure,
	src,
	editorAPI,
}: ApplyImageSrcParams) => {
	const dropzone = getImageDropzone({ figure });

	if (dropzone) {
		const img = createHTMLLayout({
			localName: "img",
			domAttrs: {
				src,
				alt: "",
				[imageObjectFitAttr.name]: imageObjectFitAttr.value.cover,
				[imageAspectRatioAttr.name]: imageAspectRatioAttr.value.auto,
			},
		});

		dropzone.$$replaceWith(img);
	} else {
		const img = getImageImg({ figure });
		img.setAttribute("src", src);
	}

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.registerSnapshotBoundary();
};
