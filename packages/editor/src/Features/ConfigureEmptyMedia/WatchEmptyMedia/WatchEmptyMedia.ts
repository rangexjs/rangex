import {
	type BlockComponent,
	blockComponentRole,
	detachedContextRole,
	isEditorNode,
} from "@rangex/core";
import type { MediaResolveCallbackParams } from "#adapters";
import type { MediaResolveDetail } from "#adapters/EmptyMedia";
import { componentsName, createComponentSelector } from "#constants";
import {
	audioAttrsShape,
	embedAttrsShape,
	imageAttrsShape,
	validateComponentAttrs,
	videoAttrsShape,
} from "#dom-attrs";
import {
	getClosestBlockComponent,
	isWellFormedUrl,
	probeMediaSrc,
} from "#engine-links";
import { assertNever } from "#utilities";
import type {
	FinalizeResolveParams,
	ResolveMediaSrcParams,
	ResolveMediaSrcResult,
	ValidateMediaAttrsParams,
	WatchEmptyMediaParams,
	WatchEmptyMediaResult,
	WithResolvedSrcParams,
} from "./WatchEmptyMedia-types";

const emptyMediaSelector = createComponentSelector(componentsName.emptyMedia);

const getMediaDetachedContext = (blockComponent: BlockComponent) => {
	const detachedContext = blockComponent.$$firstChild;

	if (
		detachedContext?.$$editorRole !== detachedContextRole ||
		!(detachedContext instanceof HTMLSlotElement)
	) {
		throw new Error("Media block's first child must be a DetachedContext.");
	}

	return detachedContext;
};

/*
 * Returns the media element's src of a submission: a URL, or a File to upload.
 */
const getMediaSrc = (detail: MediaResolveDetail): string | File => {
	if (detail.type === "image") {
		return detail.attrs.img.src;
	}

	if (detail.type === "video") {
		return detail.attrs.video.src;
	}

	if (detail.type === "audio") {
		return detail.attrs.audio.src;
	}

	if (detail.type === "embed") {
		return detail.attrs.iframe.src;
	}

	return assertNever(detail);
};

/*
 * Returns a submission's attributes with its media element's src replaced by the resolved one.
 */
const withResolvedSrc = ({
	detail,
	src,
}: WithResolvedSrcParams): MediaResolveCallbackParams => {
	if (detail.type === "image") {
		const { attrs } = detail;

		return { type: "image", attrs: { ...attrs, img: { ...attrs.img, src } } };
	}

	if (detail.type === "video") {
		const { attrs } = detail;

		return {
			type: "video",
			attrs: { ...attrs, video: { ...attrs.video, src } },
		};
	}

	if (detail.type === "audio") {
		const { attrs } = detail;

		return {
			type: "audio",
			attrs: { ...attrs, audio: { ...attrs.audio, src } },
		};
	}

	if (detail.type === "embed") {
		const { attrs } = detail;

		return {
			type: "embed",
			attrs: { ...attrs, iframe: { ...attrs.iframe, src } },
		};
	}

	return assertNever(detail);
};

/*
 * Validates the media's attributes by its component's validators, the same way every attribute written into the
 * editor is (see validateComponentAttrs). Returns whether they're valid.
 */
const validateMediaAttrs = ({
	adapterBus,
	params,
}: ValidateMediaAttrsParams) => {
	if (params.type === "image") {
		const mismatch = validateComponentAttrs({
			componentAttrs: params.attrs,
			componentAttrsShape: imageAttrsShape,
			componentAttrValidators: adapterBus.getAttrValidators("image"),
		});

		return !mismatch;
	}

	if (params.type === "video") {
		const mismatch = validateComponentAttrs({
			componentAttrs: params.attrs,
			componentAttrsShape: videoAttrsShape,
			componentAttrValidators: adapterBus.getAttrValidators("video"),
		});

		return !mismatch;
	}

	if (params.type === "audio") {
		const mismatch = validateComponentAttrs({
			componentAttrs: params.attrs,
			componentAttrsShape: audioAttrsShape,
			componentAttrValidators: adapterBus.getAttrValidators("audio"),
		});

		return !mismatch;
	}

	if (params.type === "embed") {
		const mismatch = validateComponentAttrs({
			componentAttrs: params.attrs,
			componentAttrsShape: embedAttrsShape,
			componentAttrValidators: adapterBus.getAttrValidators("embed"),
		});

		return !mismatch;
	}

	return assertNever(params);
};

/**
 * Resolves a submission's media src down to a URL, or `null` if it was invalid (an error is pushed into the slot
 * before returning `null`). File uploads report progress back into the slot as they go, guarded by `isStillCurrent`
 * since the block can disappear mid-upload.
 */
const resolveMediaSrc = async ({
	mediaSrc,
	element,
	configPort,
	isStillCurrent,
}: ResolveMediaSrcParams): ResolveMediaSrcResult => {
	if (typeof mediaSrc === "string") {
		if (!isWellFormedUrl(mediaSrc)) {
			configPort.updateElementState({
				element,
				uploadStatus: { status: "error", message: "Enter a valid URL." },
			});
			return null;
		}

		return mediaSrc;
	}

	configPort.updateElementState({
		element,
		uploadStatus: { status: "uploading", progress: 0 },
	});

	const src = await configPort.uploadFile({
		file: mediaSrc,
		onProgress: (progress) => {
			if (!isStillCurrent()) {
				return;
			}

			configPort.updateElementState({
				element,
				uploadStatus: { status: "uploading", progress },
			});
		},
	});

	if (!src) {
		configPort.updateElementState({
			element,
			uploadStatus: {
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
	adapterBus,
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
	 * Removes the placeholder block via `removeNodesInRange`, then forwards `{ type, attrs }` onto `adapterBus`, without
	 * `blockComponent`: it no longer exists in the tree by the time this fires. The media component's Adapter inserts
	 * its block at the now-collapsed selection (see its handleXInsertion).
	 */
	const finalizeResolve = ({
		blockComponent,
		params,
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

		configPort.emitMediaResolve(params);
	};

	const unsubscribeResolve = configPort.onResolve(
		async ({ element, detail }) => {
			const assignedSlot = element.assignedSlot;

			if (!(assignedSlot && isEditorNode(assignedSlot))) {
				return;
			}

			if (assignedSlot.$$editorRole !== detachedContextRole) {
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

			const src = await resolveMediaSrc({
				mediaSrc: getMediaSrc(detail),
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

			const params = withResolvedSrc({ detail, src });

			const isValid = validateMediaAttrs({ adapterBus, params });

			if (!isValid) {
				const message =
					params.type === "embed"
						? "This site can't be embedded."
						: `This ${params.type} can't be inserted.`;

				configPort.updateElementState({
					element,
					uploadStatus: { status: "error", message },
				});
				return;
			}

			// An embed can't be probed: it's a page, not a media file
			if (params.type === "embed") {
				finalizeResolve({ blockComponent, params });
				return;
			}

			configPort.updateElementState({
				element,
				uploadStatus: { status: "checking" },
			});

			const loaded = await probeMediaSrc({ type: params.type, src });

			if (!isStillCurrent()) {
				return;
			}

			if (!loaded) {
				configPort.updateElementState({
					element,
					uploadStatus: {
						status: "error",
						message: `Couldn't load that ${params.type}. Check the link and try again.`,
					},
				});
				return;
			}

			finalizeResolve({ blockComponent, params });
		},
	);

	const queryMediaBlocks = (): Set<BlockComponent> => {
		const queriedMediaBlocks =
			rootEditable.$$querySelectorAll(emptyMediaSelector);

		if (
			!queriedMediaBlocks.every(
				(mediaBlock) => mediaBlock.$$editorRole === blockComponentRole,
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
