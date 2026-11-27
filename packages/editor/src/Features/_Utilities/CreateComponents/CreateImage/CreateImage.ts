import {
  createBlockComponent,
  createBlockComponentLine,
  createBlockComponentTextHolder,
  createHTMLLayout,
} from "@rangex/core";

import { componentsName } from "#constants";
import { toDOMAttrs } from "#dom-attrs";
import { createImageStorage } from "#storage";

import type { CreateImageParams, CreateImageResult } from "./CreateImage-types";

/*
 * Builds an image block component wrapping a `figure`/`img` element, with the given attributes of its line, block and
 * `img`, and the file id its storage holds. They aren't validated here.
 */
export const createImage = ({ attrs, fileId }: CreateImageParams): CreateImageResult => {
  return createBlockComponentLine({
    domAttrs: toDOMAttrs(attrs.line),
    leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
    blockComponent: createBlockComponent({
      name: componentsName.image,
      content: { type: "custom" },
      customStorage: createImageStorage({ fileId }),
      editState: "false",
      shouldSelectOnNavigation: true,
      shouldSelectBeforeRemove: true,
      domAttrs: toDOMAttrs(attrs.block),
      childNodes: [
        createHTMLLayout({
          localName: "figure",
          childNodes: [
            createHTMLLayout({
              localName: "img",
              domAttrs: toDOMAttrs(attrs.img),
              childNodes: [],
            }),
          ],
        }),
      ],
    }),
    rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
  });
};
