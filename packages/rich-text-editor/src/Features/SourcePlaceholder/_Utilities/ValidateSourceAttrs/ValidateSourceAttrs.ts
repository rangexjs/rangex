import { assertNever } from "#utilities";

import type { ValidateSourceAttrsParams } from "./ValidateSourceAttrs-types";

/*
 * Validates the source's attributes by its component's validators. Returns whether they're valid.
 */
export const validateSourceAttrs = ({ editor, detail }: ValidateSourceAttrsParams) => {
  if (detail.type === "image") {
    return !editor.image?.validateDOMAttrs(detail.attrs);
  }

  if (detail.type === "video") {
    return !editor.video?.validateDOMAttrs(detail.attrs);
  }

  if (detail.type === "audio") {
    return !editor.audio?.validateDOMAttrs(detail.attrs);
  }

  if (detail.type === "embed") {
    return !editor.embed?.validateDOMAttrs(detail.attrs);
  }

  return assertNever(detail);
};
