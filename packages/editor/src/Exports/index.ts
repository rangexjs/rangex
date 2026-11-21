export type { EditorAPI, StoredSnapshot } from "@rangex/core";
export type {
  BlockAlignValue,
  CaptionPosition,
  CaptionState,
  CaretMenuPublicPort,
  CaretMenuQuery,
  ChangeDOMAttrsResult,
  InsertRootLinePosition,
  MediaType,
  OnDOMAttrsUpdateCallbackFn,
  ValidateDOMAttrsResult,
} from "#adapters";
export type {
  AttrRequirement,
  AttrValidationFailed,
  AttrValidationFailedFallback,
  AttrValidationFailedReject,
  AttrValue,
  ComponentAttrs,
  ComponentAttrsMismatch,
  ComponentAttrsPatch,
  ComponentAttrsShape,
  ComponentAttrValidatorOverrides,
  ComponentAttrValidators,
  ElementAttrs,
  ElementAttrsMismatch,
  ElementAttrsPatch,
  ElementAttrsShape,
  ElementAttrValidators,
  InvalidAttrMismatch,
  MissingAttrMismatch,
  UnknownAttrMismatch,
  ValidateAttrFn,
  ValidateAttrParams,
  ValidateAttrResult,
} from "#dom-attrs";
export type {
  AdapterFactoryValue,
  CreateEditorParams,
  CreateEditorResult,
  RangeXEditor,
} from "#rangex-editor";
export { createEditor } from "#rangex-editor";
export type { SnapshotSchema } from "#snapshot";
