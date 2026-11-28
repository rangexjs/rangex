import type { SourceResolveDetail } from "@rangex/editor/source-placeholder";

import { assertNever } from "#utilities";

import { createImageAltAttrs } from "../../../_Utilities";
import type { CreateSourceResolveDetailParams } from "./CreateSourceResolveDetail-types";

/*
 * Builds every attribute of the source to insert: centered, with the source element's src and its defaults (e.g. an
 * image's object fit and its alt without alt text, a video's controls). An image, video or audio carries the file id, and
 * an embed's iframe gets the configured attributes.
 */
export const createSourceResolveDetail = ({
  type,
  src,
  fileId,
  settings,
}: CreateSourceResolveDetailParams): SourceResolveDetail => {
  const line = { "data-block-align": "center" };

  if (type === "image") {
    return {
      type,
      attrs: {
        line,
        block: {},
        img: {
          src,
          ...createImageAltAttrs(""),
          "data-object-fit": "cover",
        },
      },
      fileId,
    };
  }

  if (type === "video") {
    return {
      type,
      attrs: {
        line,
        block: {},
        video: { src, controls: "", "data-object-fit": "cover" },
      },
      fileId,
    };
  }

  if (type === "audio") {
    return {
      type,
      attrs: { line, block: {}, audio: { src, controls: "" } },
      fileId,
    };
  }

  if (type === "embed") {
    const { embedIframeAttrs = {} } = settings;

    return {
      type,
      attrs: {
        line,
        block: {},
        iframe: { ...embedIframeAttrs, src },
      },
    };
  }

  return assertNever(type);
};
