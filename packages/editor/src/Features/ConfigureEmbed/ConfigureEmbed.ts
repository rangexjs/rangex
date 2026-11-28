import { componentsName } from "#constants";
import { embedAttrsShape } from "#dom-attrs";
import { createBlockComponentPlacement } from "#engine-links";

import {
  getSourceComponentParts,
  handleBlockAlignState,
  handleBlockResizeAppearance,
  handleCaptionPlaceholder,
  handleCaptionState,
  handleDOMAttrs,
  handleQuickActionsAppearance,
  handleSelectionComponent,
  handleSwapToSourcePlaceholder,
} from "../_Utilities";
import {
  getEmbedCaption,
  getEmbedFigure,
  setEmbedCaptionEnabled,
  setEmbedCaptionPosition,
} from "./_Utilities";
import type { ConfigureEmbedParams } from "./ConfigureEmbed-types";
import { handleEmbedInsertion } from "./HandleEmbedInsertion";

/*
 * Wires up the embed feature: insertion, quick-actions overlay, resize, alignment, caption, attributes and
 * source-placeholder swap behavior. Returns a cleanup function that tears down all of it.
 */
export const configureEmbed = ({ adapterBus, configPort, editorAPI }: ConfigureEmbedParams) => {
  const blockComponentPlacement = createBlockComponentPlacement({
    editorAPI,
    adapterBus,
  });

  const selectionComponentCleanup = handleSelectionComponent({
    port: configPort,
    editorAPI,
    componentName: componentsName.embed,
  });

  const insertionCleanup = handleEmbedInsertion({
    configPort,
    editorAPI,
    blockComponentPlacement,
  });

  const quickActionsCleanup = handleQuickActionsAppearance({
    port: configPort,
    quickActionsPort: configPort.quickActions,
    editorAPI,
    componentName: componentsName.embed,
  });

  const resizeAppearanceCleanup = handleBlockResizeAppearance({
    blockResize: configPort.blockResize,
    editorAPI,
    componentName: componentsName.embed,
  });

  const alignStateCleanup = handleBlockAlignState({
    port: configPort,
    editorAPI,
  });

  const captionPlaceholderCleanup = handleCaptionPlaceholder({
    editorAPI,
    componentName: componentsName.embed,
    text: configPort.captionPlaceholder,
  });

  const captionStateCleanup = handleCaptionState({
    port: configPort,
    editorAPI,
    getFigure: getEmbedFigure,
    getCaption: getEmbedCaption,
    setCaptionEnabled: setEmbedCaptionEnabled,
    setCaptionPosition: setEmbedCaptionPosition,
  });

  const domAttrsCleanup = handleDOMAttrs({
    currentComponentPort: configPort,
    domAttrsPort: configPort,
    editorAPI,
    componentAttrsShape: embedAttrsShape,
    componentAttrValidators: configPort.attrValidators,
    resolveElements: (embed) => {
      const { line, block, sourceElement } = getSourceComponentParts({
        blockComponent: embed,
        sourceElementLocalName: "iframe",
      });

      return { line, block, iframe: sourceElement };
    },
  });

  const swapCleanup = handleSwapToSourcePlaceholder({
    port: configPort,
    editorAPI,
  });

  return () => {
    selectionComponentCleanup();
    insertionCleanup();
    quickActionsCleanup();
    resizeAppearanceCleanup();
    alignStateCleanup();
    captionPlaceholderCleanup();
    captionStateCleanup();
    domAttrsCleanup();
    swapCleanup();
  };
};
