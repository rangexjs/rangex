import {
	type BlockNestedContext,
	blockNestedContextAttrName,
	blockNestedContextName,
	detachedContextName,
	isEditorNode,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import { getClosestBlockNestedContext } from "../../../NodeQuery";
import { uploadMediaFile } from "../_Utilities";
import type {
	OnMediaResolveCallbackFn,
	OnMediaResolveCallbackParams,
	WatchEmptyMediaParams,
	WatchEmptyMediaResult,
} from "./WatchEmptyMedia-types";

const emptyMediaSelector =
	`[${blockNestedContextAttrName.dataComponentName}="${componentsName.emptyMedia}"]` as const;

const getMediaDetachedContext = (blockNestedContext: BlockNestedContext) => {
	const detachedContext = blockNestedContext.$$firstChild;

	if (
		detachedContext?.$$editorRole !== detachedContextName ||
		!(detachedContext instanceof HTMLSlotElement)
	) {
		throw new Error("Media block's first child must be a DetachedContext.");
	}

	return detachedContext;
};

/**
 * Tracks `media` `BlockNestedContext`s added to the RootEditable, mounting the SolidJS
 * picker UI for each one and tearing it down once the block disappears — either removed
 * outright, or (once a Configure* module consumes {@link WatchEmptyMediaResult.onMediaResolve})
 * replaced by the real image/video/audio/embed component. RootEditable is always the source
 * of truth: this watcher reacts to whatever's actually in the tree, regardless of how it got
 * there (toolbar insertion, undo/redo, paste, etc).
 */
export const watchEmptyMedia = ({
	richTextEditorUI,
	editorAPI,
}: WatchEmptyMediaParams): WatchEmptyMediaResult => {
	const { shadowRoot, rootEditable } = editorAPI;
	const host = shadowRoot.host;

	const resolveListeners: Set<OnMediaResolveCallbackFn> = new Set();

	const emitMediaResolve = (params: OnMediaResolveCallbackParams) => {
		for (const listener of resolveListeners) {
			listener(params);
		}
	};

	const unsubscribeResolve = richTextEditorUI.emptyMediaSlot.onResolve(
		({ container, detail }) => {
			const assignedSlot = container.assignedSlot;

			if (!(assignedSlot && isEditorNode(assignedSlot))) {
				return;
			}

			if (assignedSlot.$$editorRole !== detachedContextName) {
				return;
			}

			const blockNestedContext = getClosestBlockNestedContext({
				fromNode: assignedSlot,
				componentName: componentsName.emptyMedia,
			});

			if (!blockNestedContext) {
				return;
			}

			if (detail.insertionType === "url") {
				emitMediaResolve({
					blockNestedContext,
					type: detail.type,
					src: detail.url,
				});
				return;
			}

			richTextEditorUI.emptyMediaSlot.update({
				container,
				uploadState: { status: "uploading", progress: 0 },
			});

			uploadMediaFile({
				file: detail.file,
				onProgress: (progress) =>
					richTextEditorUI.emptyMediaSlot.update({
						container,
						uploadState: { status: "uploading", progress },
					}),
			}).then(({ src }) => {
				emitMediaResolve({ blockNestedContext, type: detail.type, src });
			});
		},
	);

	const queryMediaBlocks = (): Set<BlockNestedContext> => {
		const queriedMediaBlocks =
			rootEditable.$$querySelectorAll(emptyMediaSelector);

		if (
			!queriedMediaBlocks.every(
				(mediaBlock) => mediaBlock.$$editorRole === blockNestedContextName,
			)
		) {
			throw new Error("Media block's type is invalid.");
		}

		return new Set(queriedMediaBlocks);
	};

	const containersByBlock: Map<BlockNestedContext, HTMLElement> = new Map();

	const mountMediaBlock = (blockNestedContext: BlockNestedContext) => {
		const detachedContext = getMediaDetachedContext(blockNestedContext);

		const container = document.createElement("div");

		host.appendChild(container);

		detachedContext.assign(container);

		richTextEditorUI.emptyMediaSlot.mount({ container });

		containersByBlock.set(blockNestedContext, container);
	};

	const unmountMediaBlock = (blockNestedContext: BlockNestedContext) => {
		const container = containersByBlock.get(blockNestedContext);

		if (!container) {
			throw new Error("No tracked container for the given media block.");
		}

		richTextEditorUI.emptyMediaSlot.dispose({ container });
		container.remove();

		containersByBlock.delete(blockNestedContext);
	};

	let tracked = queryMediaBlocks();

	for (const blockNestedContext of tracked) {
		mountMediaBlock(blockNestedContext);
	}

	const mediaBlockObserver = new MutationObserver(() => {
		const containedMediaBlocks = queryMediaBlocks();

		const addedMediaBlocks = containedMediaBlocks.difference(tracked);
		const removedMediaBlocks = tracked.difference(containedMediaBlocks);

		for (const blockNestedContext of addedMediaBlocks) {
			mountMediaBlock(blockNestedContext);
		}

		for (const blockNestedContext of removedMediaBlocks) {
			unmountMediaBlock(blockNestedContext);
		}

		tracked = containedMediaBlocks;
	});

	mediaBlockObserver.observe(rootEditable, { childList: true, subtree: true });

	return {
		cleanup: () => {
			mediaBlockObserver.disconnect();
			unsubscribeResolve();

			for (const blockNestedContext of tracked) {
				unmountMediaBlock(blockNestedContext);
			}

			tracked = new Set();
		},
		onMediaResolve: (callback) => {
			resolveListeners.add(callback);

			return () => {
				resolveListeners.delete(callback);
			};
		},
	};
};
