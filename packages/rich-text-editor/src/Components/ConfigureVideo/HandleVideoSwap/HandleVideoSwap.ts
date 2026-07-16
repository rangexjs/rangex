import { assertNever } from "../../../ErrorHandling";
import { getVideoElement, readFileAsDataURL } from "../_Utilities";
import type { HandleVideoSwapParams } from "./HandleVideoSwap-types";

/**
 * Wires the popover's Swap control to the engine. Only the `video`'s `src` changes —
 * object-fit, aspect ratio, playback, poster, and caption are left untouched.
 */
export const handleVideoSwap = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleVideoSwapParams) => {
	const { videoSwapPopover } = richTextEditorUI;

	const unsubscribeSwap = videoSwapPopover.onSwap((params) => {
		const { currentVideoFigure } = internals;

		if (!currentVideoFigure) {
			console.warn("Figure should have been assigned.");
			return;
		}

		const video = getVideoElement({ figure: currentVideoFigure });

		const applySrc = (src: string) => {
			video.setAttribute("src", src);

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();
		};

		if (params.source === "url") {
			applySrc(params.url);
			return;
		}

		if (params.source === "file-upload") {
			const [file] = params.files;

			if (!file) {
				return;
			}

			readFileAsDataURL(file).then(applySrc);
			return;
		}

		assertNever(params);
	});

	return () => {
		unsubscribeSwap();
	};
};
