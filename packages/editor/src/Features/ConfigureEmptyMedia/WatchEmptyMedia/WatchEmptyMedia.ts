import {
	type BlockComponent,
	blockComponentAttrName,
	blockComponentName,
	detachedContextName,
	isEditorNode,
} from "rich-text-area";
import {
	componentsName,
	getClosestBlockComponent,
	isWellFormedUrl,
	probeMediaSrc,
	transformEmbedUrl,
} from "#engine-links";
import type {
	FinalizeResolveParams,
	ResolveMediaSrcParams,
	ResolveMediaSrcResult,
	WatchEmptyMediaParams,
	WatchEmptyMediaResult,
} from "./WatchEmptyMedia-types";

const emptyMediaSelector =
	`[${blockComponentAttrName.dataComponentName}="${componentsName.emptyMedia}"]` as const;

const getMediaDetachedContext = (blockComponent: BlockComponent) => {
	const detachedContext = blockComponent.$$firstChild;

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
	configPort,
	isStillCurrent,
}: ResolveMediaSrcParams): ResolveMediaSrcResult => {
	if (detail.insertionType === "url") {
		if (!isWellFormedUrl(detail.url)) {
			configPort.updateElementState({
				element,
				uploadState: { status: "error", message: "Enter a valid URL." },
			});
			return null;
		}

		return detail.url;
	}

	configPort.updateElementState({
		element,
		uploadState: { status: "uploading", progress: 0 },
	});

	const src = await configPort.uploadFile({
		file: detail.file,
		onProgress: (progress) => {
			if (!isStillCurrent()) {
				return;
			}

			configPort.updateElementState({
				element,
				uploadState: { status: "uploading", progress },
			});
		},
	});

	if (!src) {
		configPort.updateElementState({
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

/*
 * Tracks empty media block components in the root editable, mounting a picker UI for each one
 * and resolving submissions (URL, upload, or embed) down to a final media source, replacing the
 * placeholder block once resolved. Reacts to whatever is actually in the tree, however it got
 * there. Returns a cleanup function.
 */
export const watchEmptyMedia = ({
	configPort,
	editorAPI,
}: WatchEmptyMediaParams): WatchEmptyMediaResult => {
	const { shadowRoot, rootEditable } = editorAPI;
	const host = shadowRoot.host;

	if (!(host instanceof HTMLElement)) {
		throw new Error("Host must be an HTMLElement.");
	}

	const containersByBlock: Map<BlockComponent, HTMLDivElement> = new Map();

	/**
	 * Removes the placeholder block via `removeNodesInRange` — replacing the old
	 * `$$replaceWith` swap entirely — then forwards `{type, src}` onto `adapterBus`, without
	 * `blockComponent`: it no longer exists in the tree by the time this fires. A future
	 * Image/Video/Audio/Embed extension will subscribe via `adapterBus.onMediaResolve` and
	 * call `editorAPI.insertNode` at the now-collapsed selection.
	 */
	const finalizeResolve = ({
		blockComponent,
		type,
		src,
	}: FinalizeResolveParams) => {
		const blockComponentLine = blockComponent.$$parentElement;

		if (!blockComponentLine) {
			throw new Error("Media block's parent must be a BlockComponentLine.");
		}

		editorAPI.removeNodesInRange({
			fromNode: blockComponentLine,
			fromOffset: 0,
			toNode: blockComponentLine,
			toOffset: blockComponentLine.$$childNodes.length,
		});

		editorAPI.getSnapshotTimeline().registerSnapshotBoundary();

		configPort.emitMediaResolve({ type, src });
	};

	const unsubscribeResolve = configPort.onResolve(
		async ({ element, detail }) => {
			const assignedSlot = element.assignedSlot;

			if (!(assignedSlot && isEditorNode(assignedSlot))) {
				return;
			}

			if (assignedSlot.$$editorRole !== detachedContextName) {
				return;
			}

			const blockComponent = getClosestBlockComponent({
				fromNode: assignedSlot,
				components: [componentsName.emptyMedia],
			});

			if (!blockComponent) {
				return;
			}

			// The block might not be available anymore by the time `src` is resolved.
			const isStillCurrent = () =>
				containersByBlock.get(blockComponent) === element;

			if (detail.type === "embed") {
				if (!isWellFormedUrl(detail.url)) {
					configPort.updateElementState({
						element,
						uploadState: { status: "error", message: "Enter a valid URL." },
					});
					return;
				}

				const src = transformEmbedUrl({ url: detail.url });

				finalizeResolve({ blockComponent, type: "embed", src });
				return;
			}

			const src = await resolveMediaSrc({
				detail,
				element,
				configPort,
				isStillCurrent,
			});

			if (src === null) {
				return;
			}

			if (!isStillCurrent()) {
				return;
			}

			configPort.updateElementState({
				element,
				uploadState: { status: "checking" },
			});

			const loaded = await probeMediaSrc({ type: detail.type, src });

			if (!isStillCurrent()) {
				return;
			}

			if (!loaded) {
				configPort.updateElementState({
					element,
					uploadState: {
						status: "error",
						message: `Couldn't load that ${detail.type}. Check the link and try again.`,
					},
				});
				return;
			}

			finalizeResolve({ blockComponent, type: detail.type, src });
		},
	);

	const queryMediaBlocks = (): Set<BlockComponent> => {
		const queriedMediaBlocks =
			rootEditable.$$querySelectorAll(emptyMediaSelector);

		if (
			!queriedMediaBlocks.every(
				(mediaBlock) => mediaBlock.$$editorRole === blockComponentName,
			)
		) {
			throw new Error("Media block's type is invalid.");
		}

		return new Set(queriedMediaBlocks);
	};

	const attachMediaBlock = (blockComponent: BlockComponent) => {
		const detachedContext = getMediaDetachedContext(blockComponent);

		const slottedElement = configPort.createSlottedElement();
		host.append(slottedElement);
		detachedContext.assign(slottedElement);
		containersByBlock.set(blockComponent, slottedElement);
	};

	const detachMediaBlock = (blockComponent: BlockComponent) => {
		const detachedContext = getMediaDetachedContext(blockComponent);

		const slottedElement = containersByBlock.get(blockComponent);

		if (!slottedElement) {
			throw new Error("No tracked container for the given media block.");
		}

		detachedContext.assign();
		slottedElement.remove();
		containersByBlock.delete(blockComponent);
		configPort.removeSlottedElement(slottedElement);
	};

	let tracked = queryMediaBlocks();

	for (const blockComponent of tracked) {
		attachMediaBlock(blockComponent);
	}

	const mediaBlockObserver = new MutationObserver(() => {
		const containedMediaBlocks = queryMediaBlocks();

		const addedMediaBlocks = containedMediaBlocks.difference(tracked);
		const removedMediaBlocks = tracked.difference(containedMediaBlocks);

		for (const blockComponent of addedMediaBlocks) {
			attachMediaBlock(blockComponent);
		}

		for (const blockComponent of removedMediaBlocks) {
			detachMediaBlock(blockComponent);
		}

		tracked = containedMediaBlocks;
	});

	mediaBlockObserver.observe(rootEditable, { childList: true, subtree: true });

	return () => {
		mediaBlockObserver.disconnect();
		unsubscribeResolve();

		for (const blockComponent of tracked) {
			detachMediaBlock(blockComponent);
		}

		tracked = new Set();
	};
};
