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
  ValidateSourcePlacementParams,
  ValidateSourcePlacementResult,
  WatchSourcePlaceholderParams,
  WatchSourcePlaceholderResult,
} from "./WatchSourcePlaceholder-types";

const sourcePlaceholderSelector = createComponentSelector(componentsName.sourcePlaceholder);

const getPlaceholderDetachedContext = (blockComponent: BlockComponent) => {
  const detachedContext = blockComponent.$$firstChild;

  if (
    detachedContext?.$$editorRole !== detachedContextRole ||
    !(detachedContext instanceof HTMLSlotElement)
  ) {
    throw new Error("SourcePlaceholder block's first child must be a DetachedContext.");
  }

  return detachedContext;
};

/*
 * Validates whether the source can be placed, by its component's validators. Returns the mismatch, or null when it's
 * valid.
 */
const validateSourcePlacement = ({
  adapterBus,
  detail,
}: ValidateSourcePlacementParams): ValidateSourcePlacementResult => {
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
 * submissions (see SourcePlaceholder's resolve): replaces the placeholder block with the source if its attributes are
 * valid. Reacts to whatever is actually in the tree, however it got there. Returns a cleanup function.
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
   * `blockComponent`: it no longer exists in the tree by the time this fires. The source component's Adapter inserts
   * its block at the now-collapsed selection (see its handleXInsertion).
   */
  const finalizeResolve = ({ blockComponent, detail }: FinalizeResolveParams) => {
    const blockComponentLine = blockComponent.$$parentElement;

    if (!blockComponentLine) {
      throw new Error("SourcePlaceholder block's parent must be a BlockComponentLine.");
    }

    editorAPI.removeNodesInRange({
      fromNode: blockComponentLine,
      fromOffset: 0,
      toNode: blockComponentLine,
      toOffset: blockComponentLine.$$childNodes.length,
    });

    editorAPI.getSnapshotTimeline().registerSnapshotBoundary();

    configPort.emitSourceResolve(detail);
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

    const placementMismatch = validateSourcePlacement({ adapterBus, detail });

    if (placementMismatch) {
      console.warn(placementMismatch);
      return;
    }

    finalizeResolve({ blockComponent, detail });
  });

  const queryPlaceholderBlocks = (): Set<BlockComponent> => {
    const queriedPlaceholderBlocks = rootEditable.$$querySelectorAll(sourcePlaceholderSelector);

    if (
      !queriedPlaceholderBlocks.every(
        (placeholderBlock) => placeholderBlock.$$editorRole === blockComponentRole,
      )
    ) {
      throw new Error("SourcePlaceholder block's type is invalid.");
    }

    return new Set(queriedPlaceholderBlocks);
  };

  const attachPlaceholderBlock = (blockComponent: BlockComponent) => {
    const detachedContext = getPlaceholderDetachedContext(blockComponent);

    const slottedElement = configPort.createSlottedElement();
    host.append(slottedElement);
    detachedContext.assign(slottedElement);
    containersByBlock.set(blockComponent, slottedElement);
  };

  const detachPlaceholderBlock = (blockComponent: BlockComponent) => {
    const detachedContext = getPlaceholderDetachedContext(blockComponent);

    const slottedElement = containersByBlock.get(blockComponent);

    if (!slottedElement) {
      throw new Error("No tracked container for the given SourcePlaceholder block.");
    }

    detachedContext.assign();
    slottedElement.remove();
    containersByBlock.delete(blockComponent);
    configPort.removeSlottedElement(slottedElement);
  };

  let tracked = queryPlaceholderBlocks();

  for (const blockComponent of tracked) {
    attachPlaceholderBlock(blockComponent);
  }

  const placeholderBlockObserver = new MutationObserver(() => {
    const containedPlaceholderBlocks = queryPlaceholderBlocks();

    const addedPlaceholderBlocks = containedPlaceholderBlocks.difference(tracked);
    const removedPlaceholderBlocks = tracked.difference(containedPlaceholderBlocks);

    for (const blockComponent of addedPlaceholderBlocks) {
      attachPlaceholderBlock(blockComponent);
    }

    for (const blockComponent of removedPlaceholderBlocks) {
      detachPlaceholderBlock(blockComponent);
    }

    tracked = containedPlaceholderBlocks;
  });

  placeholderBlockObserver.observe(rootEditable, { childList: true, subtree: true });

  return () => {
    placeholderBlockObserver.disconnect();
    unsubscribeResolve();

    for (const blockComponent of tracked) {
      detachPlaceholderBlock(blockComponent);
    }

    tracked = new Set();
  };
};
