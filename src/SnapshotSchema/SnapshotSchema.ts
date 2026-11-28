import type { SnapshotSchema } from "@rangex/rich-text-editor";
import { configureSanitizer, type SanitizerPolicy } from "@rangex/rich-text-editor/snapshot";

import { embedAttrValidators } from "../ExtensionSettings";

const sanitizerPolicies: SanitizerPolicy[] = [];

configureSanitizer(...sanitizerPolicies);

export const snapshotSchema: SnapshotSchema = {
  limits: {
    maxDepth: 100,
    maxNodeCount: 50_000,
    maxTextLength: 100_000,
  },
  root: { types: ["rich-text"] },
  components: {
    accordionItem: {},
    audio: {},
    blockQuote: {},
    codeBlock: {},
    embed: { attrValidators: embedAttrValidators },
    sourcePlaceholder: {},
    image: {},
    link: {},
    list: {},
    mention: {},
    separator: {},
    table: {},
    templateVariable: {},
    todoList: {},
    video: {},
  },
};
