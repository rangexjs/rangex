import { assertNever } from "../../../ErrorHandling";
import { applyAudioSrc, readFileAsDataURL } from "../_Utilities";
import type { HandleAudioSwapParams } from "./HandleAudioSwap-types";

/**
 * Wires the popover's Swap control to the engine. Only the `audio`'s `src` changes —
 * playback settings and caption are left untouched.
 */
export const handleAudioSwap = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleAudioSwapParams) => {
	const { audioSwapPopover } = richTextEditorUI;

	const unsubscribeSwap = audioSwapPopover.onSwap((params) => {
		const { currentAudioFigure } = internals;

		if (!currentAudioFigure) {
			console.warn("Figure should have been assigned.");
			return;
		}

		if (params.source === "url") {
			applyAudioSrc({
				figure: currentAudioFigure,
				src: params.url,
				editorAPI,
			});
			return;
		}

		if (params.source === "file-upload") {
			const [file] = params.files;

			if (!file) {
				return;
			}

			readFileAsDataURL(file).then((src) => {
				applyAudioSrc({ figure: currentAudioFigure, src, editorAPI });
			});
			return;
		}

		assertNever(params);
	});

	return () => {
		unsubscribeSwap();
	};
};
