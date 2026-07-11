import { componentsName } from "../../../Constants";
import { assertNever } from "../../../ErrorHandling";
import { getImageFigure, getImageImg, readFileAsDataURL } from "../_Utilities";
import type { HandleImageSwapParams } from "./HandleImageSwap-types";

/**
 * Wires the popover's Swap control to the engine. Only the `img`'s `src` changes —
 * object-fit, aspect ratio, and caption are left untouched.
 */
export const handleImageSwap = ({
	richTextEditorUI,
	editorAPI,
	blockPopoverAppearanceHandler,
}: HandleImageSwapParams) => {
	const { imagePopover } = richTextEditorUI;

	const unsubscribeSwap = imagePopover.onSwap((params) => {
		const currentBlock = blockPopoverAppearanceHandler.getCurrentBlock({
			componentName: componentsName.image,
		});

		if (!currentBlock) {
			return;
		}

		const figure = getImageFigure({ blockNestedContext: currentBlock });
		const img = getImageImg({ figure });

		const applySrc = (src: string) => {
			img.setAttribute("src", src);

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
