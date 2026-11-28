import {
  blockComponentRole,
  type HTMLLayoutDraft,
  htmlLayoutRole,
  nestedEditableRole,
} from "@rangex/core";

import { sourceCaptionDefinition } from "#constants";

import {
  formatNodePath,
  resolveDraftDOMAttrs,
  validateHTMLLayoutState,
  validateNestedEditableState,
} from "../../../_Utilities";
import { validateBlockComponentLine } from "../ValidateBlockComponentLine";
import { validateBlockComponentState } from "../ValidateBlockComponentState";
import type {
  FindHTMLLayoutDraftParams,
  FindHTMLLayoutDraftResult,
  ValidateFigcaptionParams,
  ValidateFigcaptionResult,
  ValidateFigureParams,
  ValidateFigureResult,
  ValidateSourceComponentParams,
  ValidateSourceComponentResult,
  ValidateSourceElementParams,
  ValidateSourceElementResult,
} from "./ValidateSourceComponent-types";

const findHTMLLayoutDraft = ({
  childNodes,
  localName,
}: FindHTMLLayoutDraftParams): FindHTMLLayoutDraftResult =>
  childNodes.find(
    (childDraft): childDraft is HTMLLayoutDraft =>
      childDraft.editorRole === htmlLayoutRole && childDraft.localName === localName,
  );

const validateSourceElement = ({
  componentDraft,
  htmlLayoutDraft,
  sourceElementLocalName,
  sourceElementAttrsShape,
  sourceElementAttrValidators,
}: ValidateSourceElementParams): ValidateSourceElementResult => {
  const stateFailed = validateHTMLLayoutState({
    componentDraft,
    htmlLayoutDraft,
    expectedState: {
      editorRole: htmlLayoutRole,
      localName: sourceElementLocalName,
      customStorage: null,
    },
  });

  if (stateFailed) {
    return stateFailed;
  }

  const domAttrsFailed = resolveDraftDOMAttrs({
    rootDraft: componentDraft,
    elementDraft: htmlLayoutDraft,
    elementAttrsShape: sourceElementAttrsShape,
    elementAttrValidators: sourceElementAttrValidators,
  });

  if (domAttrsFailed) {
    return domAttrsFailed;
  }

  if (htmlLayoutDraft.childNodes.length) {
    return {
      sourceSnapshot: componentDraft,
      failedSnapshot: htmlLayoutDraft,
      reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must have no children.`,
    };
  }

  return null;
};

/*
 * Validates the figcaption and its only child, the NestedEditable created by the component's setXCaptionEnabled. The
 * NestedEditable's content is left to the engine's validation.
 */
const validateFigcaption = ({
  componentDraft,
  htmlLayoutDraft,
}: ValidateFigcaptionParams): ValidateFigcaptionResult => {
  const stateFailed = validateHTMLLayoutState({
    componentDraft,
    htmlLayoutDraft,
    expectedState: {
      editorRole: htmlLayoutRole,
      localName: "figcaption",
      customStorage: null,
    },
  });

  if (stateFailed) {
    return stateFailed;
  }

  const domAttrsFailed = resolveDraftDOMAttrs({
    rootDraft: componentDraft,
    elementDraft: htmlLayoutDraft,
    elementAttrsShape: {},
    elementAttrValidators: {},
  });

  if (domAttrsFailed) {
    return domAttrsFailed;
  }

  const { childNodes } = htmlLayoutDraft;

  const nestedEditableDraft = childNodes.at(0);

  if (childNodes.length !== 1 || nestedEditableDraft?.editorRole !== nestedEditableRole) {
    return {
      sourceSnapshot: componentDraft,
      failedSnapshot: htmlLayoutDraft,
      reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must contain exactly one ${nestedEditableRole}.`,
    };
  }

  const nestedEditableFailed = validateNestedEditableState({
    componentDraft,
    nestedEditableDraft,
    expectedState: {
      editorRole: nestedEditableRole,
      ...sourceCaptionDefinition.nestedEditableProps,
      domAttrs: {},
      customStorage: null,
    },
  });

  if (nestedEditableFailed) {
    return nestedEditableFailed;
  }

  return null;
};

/*
 * Validates the figure and its children: exactly one source element, and at most one figcaption, above or below it.
 */
const validateFigure = ({
  componentDraft,
  htmlLayoutDraft,
  sourceElementLocalName,
  sourceElementAttrsShape,
  sourceElementAttrValidators,
}: ValidateFigureParams): ValidateFigureResult => {
  const stateFailed = validateHTMLLayoutState({
    componentDraft,
    htmlLayoutDraft,
    expectedState: {
      editorRole: htmlLayoutRole,
      localName: "figure",
      customStorage: null,
    },
  });

  if (stateFailed) {
    return stateFailed;
  }

  const domAttrsFailed = resolveDraftDOMAttrs({
    rootDraft: componentDraft,
    elementDraft: htmlLayoutDraft,
    elementAttrsShape: {},
    elementAttrValidators: {},
  });

  if (domAttrsFailed) {
    return domAttrsFailed;
  }

  const { childNodes } = htmlLayoutDraft;

  const sourceElementDraft = findHTMLLayoutDraft({
    childNodes,
    localName: sourceElementLocalName,
  });

  const figcaptionDraft = findHTMLLayoutDraft({
    childNodes,
    localName: "figcaption",
  });

  // The source element, and the figcaption if there's one: any other child (e.g. a second source element) changes the
  // count
  const expectedLength = [sourceElementDraft, figcaptionDraft].filter(Boolean).length;

  if (!sourceElementDraft || childNodes.length !== expectedLength) {
    return {
      sourceSnapshot: componentDraft,
      failedSnapshot: htmlLayoutDraft,
      reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must contain exactly one ${sourceElementLocalName}, and at most one figcaption.`,
    };
  }

  const sourceElementFailed = validateSourceElement({
    componentDraft,
    htmlLayoutDraft: sourceElementDraft,
    sourceElementLocalName,
    sourceElementAttrsShape,
    sourceElementAttrValidators,
  });

  if (sourceElementFailed) {
    return sourceElementFailed;
  }

  if (figcaptionDraft) {
    const figcaptionFailed = validateFigcaption({
      componentDraft,
      htmlLayoutDraft: figcaptionDraft,
    });

    if (figcaptionFailed) {
      return figcaptionFailed;
    }
  }

  return null;
};

/*
 * Validates a source component (Image, Video, Audio, Embed), its BlockComponentLine, and everything down to its
 * figcaption's NestedEditable, node by node: each node's own state, then its children. They're all built the same way:
 * a BlockComponent holding a figure, which holds one source element (e.g. an img) and an optional figcaption. The
 * line's, the block's and the source element's domAttrs are resolved by the given shapes and validators, the figure's
 * and the figcaption's by an empty shape. The NestedEditable's content is left to the engine's validation.
 */
export const validateSourceComponent = ({
  componentDraft,
  name,
  customStorage,
  sourceElementLocalName,
  lineAttrsShape,
  lineAttrValidators,
  blockAttrsShape,
  blockAttrValidators,
  sourceElementAttrsShape,
  sourceElementAttrValidators,
}: ValidateSourceComponentParams): ValidateSourceComponentResult => {
  if (componentDraft.editorRole !== blockComponentRole) {
    return {
      sourceSnapshot: componentDraft,
      failedSnapshot: componentDraft,
      reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must be a ${blockComponentRole}.`,
    };
  }

  const stateFailed = validateBlockComponentState({
    blockComponentDraft: componentDraft,
    expectedState: {
      editorRole: blockComponentRole,
      name,
      content: { type: "custom" },
      editState: "false",
      shouldSelectBeforeRemove: true,
      shouldSelectOnNavigation: true,
      customStorage,
    },
  });

  if (stateFailed) {
    return stateFailed;
  }

  const lineFailed = validateBlockComponentLine({
    blockComponentDraft: componentDraft,
    lineAttrsShape,
    lineAttrValidators,
  });

  if (lineFailed) {
    return lineFailed;
  }

  const domAttrsFailed = resolveDraftDOMAttrs({
    rootDraft: componentDraft,
    elementDraft: componentDraft,
    elementAttrsShape: blockAttrsShape,
    elementAttrValidators: blockAttrValidators,
  });

  if (domAttrsFailed) {
    return domAttrsFailed;
  }

  const { childNodes } = componentDraft;

  const htmlLayoutDraft = childNodes.at(0);

  if (childNodes.length !== 1 || htmlLayoutDraft?.editorRole !== htmlLayoutRole) {
    return {
      sourceSnapshot: componentDraft,
      failedSnapshot: componentDraft,
      reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must contain exactly one ${htmlLayoutRole}.`,
    };
  }

  const figureFailed = validateFigure({
    componentDraft,
    htmlLayoutDraft,
    sourceElementLocalName,
    sourceElementAttrsShape,
    sourceElementAttrValidators,
  });

  if (figureFailed) {
    return figureFailed;
  }

  return null;
};
