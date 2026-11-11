import {
	type BlockComponent,
	blockComponentRole,
	detachedContextRole,
	isEditorNode,
} from "@rangex/core";

import { componentsName, createComponentSelector } from "#constants";
import { getClosestBlockComponent } from "#engine-links";
import { assertNever } from "#utilities";

import {
	validateAudioPlacement,
	validateEmbedPlacement,
	validateImagePlacement,
	validateVideoPlacement,
} from "../../_Utilities";
import type {
	FinalizeResolveParams,
	ValidateMediaPlacementParams,
	ValidateMediaPlacementResult,
	WatchSourcePlaceholderParams,
	WatchSourcePlaceholderResult,
} from "./WatchSourcePlaceholder-types";

const sourcePlaceholderSelector = createComponentSelector(componentsName.sourcePlaceholder);

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
 * Validates whether the media can be placed, by its component's validators. Returns the mismatch, or null when it's
 * valid.
 */
const validateMediaPlacement = ({
	adapterBus,
	detail,
}: ValidateMediaPlacementParams): ValidateMediaPlacementResult => {
	if (detail.type === "image") {
		const imageFailed = validateImagePlacement({
			attrValidators: adapterBus.getAttrValidators("image"),
			attrs: detail.attrs,
		});

		if (imageFailed) {
			return imageFailed;
		}

		return null;
	}

	if (detail.type === "video") {
		const videoFailed = validateVideoPlacement({
			attrValidators: adapterBus.getAttrValidators("video"),
			attrs: detail.attrs,
		});

		if (videoFailed) {
			return videoFailed;
		}

		return null;
	}

	if (detail.type === "audio") {
		const audioFailed = validateAudioPlacement({
			attrValidators: adapterBus.getAttrValidators("audio"),
			attrs: detail.attrs,
		});

		if (audioFailed) {
			return audioFailed;
		}

		return null;
	}

	if (detail.type === "embed") {
		const embedFailed = validateEmbedPlacement({
			attrValidators: adapterBus.getAttrValidators("embed"),
			attrs: detail.attrs,
		});

		if (embedFailed) {
			return embedFailed;
		}

		return null;
	}

	return assertNever(detail);
};

/*
 * Tracks source placeholder block components in the root editable, mounting a slotted element for each one, and resolves
 * submissions (see SourcePlaceholder's resolve): replaces the placeholder block with the media if its attributes are valid.
 * Reacts to whatever is actually in the tree, however it got there. Returns a cleanup function.
 */
export const watchSourcePlaceholder = ({
	adapterBus,
	configPort,
	editorAPI,
}: WatchSourcePlaceholderParams): WatchSourcePlaceholderResult => {
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
	const finalizeResolve = ({ blockComponent, detail }: FinalizeResolveParams) => {
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

		configPort.emitMediaResolve(detail);
	};

	const unsubscribeResolve = configPort.onResolve(({ element, detail }) => {
		const assignedSlot = element.assignedSlot;

		if (!(assignedSlot && isEditorNode(assignedSlot))) {
			return;
		}

		if (assignedSlot.$$editorRole !== detachedContextRole) {
			return;
		}

		const blockComponent = getClosestBlockComponent({
			fromNode: assignedSlot,
			components: [componentsName.sourcePlaceholder],
		});

		if (!blockComponent) {
			return;
		}

		const placementMismatch = validateMediaPlacement({ adapterBus, detail });

		if (placementMismatch) {
			console.warn(placementMismatch);
			return;
		}

		finalizeResolve({ blockComponent, detail });
	});

	const queryMediaBlocks = (): Set<BlockComponent> => {
		const queriedMediaBlocks = rootEditable.$$querySelectorAll(sourcePlaceholderSelector);

		if (!queriedMediaBlocks.every((mediaBlock) => mediaBlock.$$editorRole === blockComponentRole)) {
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
