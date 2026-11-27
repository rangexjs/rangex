import {
  createBlockComponent,
  createBlockComponentLine,
  createBlockComponentTextHolder,
  createHTMLLayout,
} from "@rangex/core";

import { componentsName } from "#constants";
import { toDOMAttrs } from "#dom-attrs";
import { createVideoStorage } from "#storage";

import type { CreateVideoParams, CreateVideoResult } from "./CreateVideo-types";

/*
 * Builds a video block component wrapping a `figure`/`video` element, with the given attributes of its line, block and
 * `video`, and the file id its storage holds. They aren't validated here.
 */
export const createVideo = ({ attrs, fileId }: CreateVideoParams): CreateVideoResult => {
  return createBlockComponentLine({
    domAttrs: toDOMAttrs(attrs.line),
    leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
    blockComponent: createBlockComponent({
      name: componentsName.video,
      content: { type: "custom" },
      customStorage: createVideoStorage({ fileId }),
      editState: "false",
      shouldSelectOnNavigation: true,
      shouldSelectBeforeRemove: true,
      domAttrs: toDOMAttrs(attrs.block),
      childNodes: [
        createHTMLLayout({
          localName: "figure",
          childNodes: [
            createHTMLLayout({
              localName: "video",
              domAttrs: toDOMAttrs(attrs.video),
              childNodes: [],
            }),
          ],
        }),
      ],
    }),
    rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
  });
};
