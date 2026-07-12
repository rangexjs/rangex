import { componentsName } from "../../../Constants";
import { assertNever } from "../../../ErrorHandling";
import {
	getVideoElement,
	getVideoFigure,
	readFileAsDataURL,
} from "../_Utilities";
import type { HandleVideoSwapParams } from "./HandleVideoSwap-types";

/**
 * Wires the popover's Swap control to the engine. Only the `video`'s `src` changes —
 * object-fit, aspect ratio, playback, poster, and caption are left untouched.
 */
export const handleVideoSwap = ({
	richTextEditorUI,
	editorAPI,
	blockPopoverAppearanceHandler,
}: HandleVideoSwapParams) => {
	const { videoPopover } = richTextEditorUI;

	const unsubscribeSwap = videoPopover.onSwap((params) => {
		const currentBlock = blockPopoverAppearanceHandler.getCurrentBlock({
			componentName: componentsName.video,
		});

		if (!currentBlock) {
			return;
		}

		const figure = getVideoFigure({ blockNestedContext: currentBlock });
		const video = getVideoElement({ figure });

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
