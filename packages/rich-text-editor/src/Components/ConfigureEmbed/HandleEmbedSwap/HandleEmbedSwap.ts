import { isWellFormedUrl, transformEmbedUrl } from "../../../_Utilities";
import { applyEmbedSrc } from "../_Utilities";
import type {
	HandleEmbedSwapParams,
	ResolveSwapSrcParams,
	ResolveSwapSrcResult,
} from "./HandleEmbedSwap-types";

/**
 * Resolves a swap submission down to a single `src`, or `null` if the URL was invalid —
 * an error is pushed into the popover before returning `null`. Unlike its image/video/audio
 * counterparts this never needs to be `async`: there's no file-upload branch (embed is
 * URL-only) and no load probe (there's no reliable load signal for iframe content), so
 * well-formedness plus the provider URL rewrite are both synchronous.
 */
const resolveSwapSrc = ({
	embedEmitSwapParams,
	embedSwapPopover,
}: ResolveSwapSrcParams): ResolveSwapSrcResult => {
	if (!isWellFormedUrl(embedEmitSwapParams.url)) {
		embedSwapPopover.updateCheckState({
			status: "error",
			message: "Enter a valid URL.",
		});
		return null;
	}

	return transformEmbedUrl({ url: embedEmitSwapParams.url });
};

/**
 * Wires the popover's Swap control to the engine. Only the embed's `src` changes — caption
 * and other attributes are left untouched. Runs entirely synchronously: unlike
 * image/video/audio there's no in-flight probe or upload to protect against, so there's no
 * staleness guard needed between resolving `src` and applying it.
 */
export const handleEmbedSwap = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleEmbedSwapParams) => {
	const { embedSwapPopover } = richTextEditorUI;

	const unsubscribeSwap = embedSwapPopover.onSwap((params) => {
		const { currentEmbedFigure } = internals;

		if (!currentEmbedFigure) {
			console.warn("Figure should have been assigned.");
			return;
		}

		const src = resolveSwapSrc({
			embedEmitSwapParams: params,
			embedSwapPopover,
		});

		if (src === null) {
			return;
		}

		applyEmbedSrc({ figure: currentEmbedFigure, src, editorAPI });
		embedSwapPopover.updateCheckState({ status: "idle" });
		embedSwapPopover.popover.hidePopover();
	});

	return () => {
		unsubscribeSwap();
	};
};
