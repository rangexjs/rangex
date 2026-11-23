import { createSnapshotView } from "@rangex/editor/snapshot";

import { getViewStyles } from "../../EngineStyles";
import type {
  CreateRichTextSnapshotViewParams,
  CreateRichTextSnapshotViewResult,
} from "./CreateRichTextSnapshotView-types";

export const createRichTextSnapshotView = ({
  storedSnapshot,
  limits,
  highlightCode,
}: CreateRichTextSnapshotViewParams): CreateRichTextSnapshotViewResult => {
  const styles = getViewStyles();

  const result = createSnapshotView({
    styles,
    storedSnapshot,
    limits,
    highlightCode,
  });

  return result;
};
