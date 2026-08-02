import {
	type BlockNestedContext,
	blockNestedContextAttrName,
	blockNestedContextName,
	detachedContextName,
	isEditorNode,
} from "rich-text-area";
import { componentsName } from "#ports";
import {
	isWellFormedUrl,
	probeMediaSrc,
	transformEmbedUrl,
	uploadMediaFile,
} from "../../../_Utilities";
import { getClosestBlockNestedContext } from "../../../NodeQuery";
import type {
	FinalizeResolveParams,
	ResolveMediaSrcParams,
	ResolveMediaSrcResult,
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
 * Resolves a picker submission down to a single `src`, or `null` if the URL was invalid
 * (an error is pushed into the slot before returning `null`). File uploads report progress
 * back into the slot as they go, guarded by `isStillCurrent` since the block can disappear
 * mid-upload.
 */
const resolveMediaSrc = async ({
	detail,
	element,
	editorPort,
	isStillCurrent,
}: ResolveMediaSrcParams): ResolveMediaSrcResult => {
	if (detail.insertionType === "url") {
		if (!isWellFormedUrl(detail.url)) {
			editorPort.updateElementState({
				element,
				uploadState: { status: "error", message: "Enter a valid URL." },
			});
			return null;
		}

		return detail.url;
	}

	editorPort.updateElementState({
		element,
		uploadState: { status: "uploading", progress: 0 },
	});

	const src = await uploadMediaFile({
		file: detail.file,
		onProgress: (progress) => {
			if (!isStillCurrent()) {
				return;
			}

			editorPort.updateElementState({
				element,
				uploadState: { status: "uploading", progress },
			});
		},
	});

	if (!src) {
		editorPort.updateElementState({
			element,
			uploadState: {
				status: "error",
				message: "Couldn't read that file. Try a different one.",
			},
		});
		return null;
	}

	return src;
};

/**
 * Tracks `media` `BlockNestedContext`s added to the RootEditable, mounting the SolidJS picker
 * UI for each one via the adapter's `attach`/`detach`, and tearing it down once the block
 * disappears — either removed outright, or (once resolved) removed by `finalizeResolve` below.
 * RootEditable is always the source of truth: this watcher reacts to whatever's actually in
 * the tree, regardless of how it got there (toolbar insertion, undo/redo, paste, etc).
 */
export const watchEmptyMedia = ({
	editorPort,
	editorAPI,
}: WatchEmptyMediaParams): WatchEmptyMediaResult => {
	const { shadowRoot, rootEditable } = editorAPI;
	const host = shadowRoot.host;

	const containersByBlock: Map<BlockNestedContext, HTMLElement> = new Map();

	/**
	 * Removes the placeholder block via `removeNodesInRange` — replacing the old
	 * `$$replaceWith` swap entirely — then forwards `{type, src}` onto `adapterBus`, without
	 * `blockNestedContext`: it no longer exists in the tree by the time this fires. A future
	 * Image/Video/Audio/Embed extension will subscribe via `adapterBus.onMediaResolve` and
	 * call `editorAPI.insertNode` at the now-collapsed selection.
	 */
	const finalizeResolve = ({
		blockNestedContext,
		type,
		src,
	}: FinalizeResolveParams) => {
		const blockNestedContextLine = blockNestedContext.$$parentElement;

		if (!blockNestedContextLine) {
			throw new Error("Media block's parent must be a BlockNestedContextLine.");
		}

		editorAPI.removeNodesInRange({
			fromNode: blockNestedContextLine,
			fromOffset: 0,
			toNode: blockNestedContextLine,
			toOffset: blockNestedContextLine.$$childNodes.length,
		});

		editorAPI.getSnapshotTimeline().registerSnapshotBoundary();

		editorPort.emitMediaResolve({ type, src });
	};

	const unsubscribeResolve = editorPort.onResolve(
		async ({ element, detail }) => {
			const assignedSlot = element.assignedSlot;

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

			// The block might not be available anymore by the time `src` is resolved.
			const isStillCurrent = () =>
				containersByBlock.get(blockNestedContext) === element;

			if (detail.type === "embed") {
				if (!isWellFormedUrl(detail.url)) {
					editorPort.updateElementState({
						element,
						uploadState: { status: "error", message: "Enter a valid URL." },
					});
					return;
				}

				const src = transformEmbedUrl({ url: detail.url });

				finalizeResolve({ blockNestedContext, type: "embed", src });
				return;
			}

			const src = await resolveMediaSrc({
				detail,
				element,
				editorPort,
				isStillCurrent,
			});

			if (src === null) {
				return;
			}

			if (!isStillCurrent()) {
				return;
			}

			editorPort.updateElementState({
				element,
				uploadState: { status: "checking" },
			});

			const loaded = await probeMediaSrc({ type: detail.type, src });

			if (!isStillCurrent()) {
				return;
			}

			if (!loaded) {
				editorPort.updateElementState({
					element,
					uploadState: {
						status: "error",
						message: `Couldn't load that ${detail.type}. Check the link and try again.`,
					},
				});
				return;
			}

			finalizeResolve({ blockNestedContext, type: detail.type, src });
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

	const attachMediaBlock = (blockNestedContext: BlockNestedContext) => {
		const detachedContext = getMediaDetachedContext(blockNestedContext);

		const element = document.createElement("div");

		host.appendChild(element);

		detachedContext.assign(element);

		editorPort.attach({ element });

		containersByBlock.set(blockNestedContext, element);
	};

	const detachMediaBlock = (blockNestedContext: BlockNestedContext) => {
		const element = containersByBlock.get(blockNestedContext);

		if (!element) {
			throw new Error("No tracked container for the given media block.");
		}

		editorPort.detach({ element });
		element.remove();

		containersByBlock.delete(blockNestedContext);
	};

	let tracked = queryMediaBlocks();

	for (const blockNestedContext of tracked) {
		attachMediaBlock(blockNestedContext);
	}

	const mediaBlockObserver = new MutationObserver(() => {
		const containedMediaBlocks = queryMediaBlocks();

		const addedMediaBlocks = containedMediaBlocks.difference(tracked);
		const removedMediaBlocks = tracked.difference(containedMediaBlocks);

		for (const blockNestedContext of addedMediaBlocks) {
			attachMediaBlock(blockNestedContext);
		}

		for (const blockNestedContext of removedMediaBlocks) {
			detachMediaBlock(blockNestedContext);
		}

		tracked = containedMediaBlocks;
	});

	mediaBlockObserver.observe(rootEditable, { childList: true, subtree: true });

	return () => {
		mediaBlockObserver.disconnect();
		unsubscribeResolve();

		for (const blockNestedContext of tracked) {
			detachMediaBlock(blockNestedContext);
		}

		tracked = new Set();
	};
};
