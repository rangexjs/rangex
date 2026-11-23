import { createSnapshotView as createEngineSnapshotView } from "@rangex/core";

import { ensureSanitizerConfigured } from "#sanitizer";

import { buildViewStyleText } from "../../Styles";
import { highlightCodeBlocks } from "../HighlightCodeBlocks";
import type {
  CreateSnapshotViewParams,
  CreateSnapshotViewResult,
} from "./CreateSnapshotView-types";

/*
 * Creates the engine's SnapshotView, validated by the SanitizerPolicies set by configureSanitizer (the basePolicy alone
 * if it hasn't been called), with `styles` appended to its styles. Code blocks are syntax highlighted when
 * `highlightCode` is given.
 */
export const createSnapshotView = ({
  storedSnapshot,
  limits,
  styles,
  highlightCode,
}: CreateSnapshotViewParams): CreateSnapshotViewResult => {
  ensureSanitizerConfigured();

  const { snapshotView } = createEngineSnapshotView({ storedSnapshot, limits });

  if (highlightCode) {
    highlightCodeBlocks({ nodeView: snapshotView.tree, highlightCode });
  }

  const viewStyleText = buildViewStyleText(styles);
  const viewStyles = snapshotView.styles + viewStyleText;

  return {
    snapshotView: {
      ...snapshotView,
      styles: viewStyles,
    },
  };
};
