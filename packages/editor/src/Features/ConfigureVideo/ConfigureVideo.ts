import { componentsName } from "#constants";
import { videoAttrsShape } from "#dom-attrs";
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
  getVideoCaption,
  getVideoFigure,
  setVideoCaptionEnabled,
  setVideoCaptionPosition,
} from "./_Utilities";
import type { ConfigureVideoParams } from "./ConfigureVideo-types";
import { handleVideoInsertion } from "./HandleVideoInsertion";

/*
 * Wires up the video feature: insertion, quick-actions overlay, resize, alignment, caption, attributes and
 * source-placeholder swap behavior. Returns a cleanup function that tears down all of it.
 */
export const configureVideo = ({ adapterBus, configPort, editorAPI }: ConfigureVideoParams) => {
  const blockComponentPlacement = createBlockComponentPlacement({
    editorAPI,
    adapterBus,
  });

  const selectionComponentCleanup = handleSelectionComponent({
    port: configPort,
    editorAPI,
    componentName: componentsName.video,
  });

  const insertionCleanup = handleVideoInsertion({
    configPort,
    editorAPI,
    blockComponentPlacement,
  });

  const quickActionsCleanup = handleQuickActionsAppearance({
    port: configPort,
    quickActionsPort: configPort.quickActions,
    editorAPI,
    componentName: componentsName.video,
  });

  const resizeAppearanceCleanup = handleBlockResizeAppearance({
    blockResize: configPort.blockResize,
    editorAPI,
    componentName: componentsName.video,
  });

  const alignStateCleanup = handleBlockAlignState({
    port: configPort,
    editorAPI,
  });

  const captionPlaceholderCleanup = handleCaptionPlaceholder({
    editorAPI,
    componentName: componentsName.video,
    text: configPort.captionPlaceholder,
  });

  const captionStateCleanup = handleCaptionState({
    port: configPort,
    editorAPI,
    getFigure: getVideoFigure,
    getCaption: getVideoCaption,
    setCaptionEnabled: setVideoCaptionEnabled,
    setCaptionPosition: setVideoCaptionPosition,
  });

  const domAttrsCleanup = handleDOMAttrs({
    currentComponentPort: configPort,
    domAttrsPort: configPort,
    editorAPI,
    componentAttrsShape: videoAttrsShape,
    componentAttrValidators: configPort.attrValidators,
    resolveElements: (video) => {
      const { line, block, sourceElement } = getSourceComponentParts({
        blockComponent: video,
        sourceElementLocalName: "video",
      });

      return { line, block, video: sourceElement };
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
