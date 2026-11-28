import { type CreateFallbackRootEditable, createEditorAPI } from "@rangex/core";

import { glyphFormatterInlineTagsOrder } from "#constants";
import { ensureSanitizerConfigured } from "#sanitizer";

import { buildEditorStyleText } from "../../Styles";
import { resolveStoredSnapshot } from "../ResolveStoredSnapshot";
import type {
  CreateCoreParams,
  CreateCoreResult,
  CreateFallbackRootEditableFnParams,
  ResolveInitialStoredSnapshotParams,
  ResolveInitialStoredSnapshotResult,
} from "./CreateCore-types";
import { createRoot } from "./CreateRoot";

/*
 * Resolves the snapshot the editor starts with: the given one once it's migrated and validated, or null if none was given
 * or it can't be loaded. The failure is kept to tell the consumer why.
 */
const resolveInitialStoredSnapshot = ({
  storedSnapshot,
  snapshotSchema,
}: ResolveInitialStoredSnapshotParams): ResolveInitialStoredSnapshotResult => {
  if (!storedSnapshot) {
    return { resolvedStoredSnapshot: null, resolvedStoredSnapshotFailed: null };
  }

  const resolveResult = resolveStoredSnapshot({ storedSnapshot, snapshotSchema });

  if (!resolveResult.isValid) {
    return { resolvedStoredSnapshot: null, resolvedStoredSnapshotFailed: resolveResult };
  }

  return {
    resolvedStoredSnapshot: resolveResult.storedSnapshot,
    resolvedStoredSnapshotFailed: null,
  };
};

/*
 * Creates the engine's fallback for a snapshot that's missing or can't be loaded: a new root of the schema's first root
 * type, with one empty paragraph.
 */
const createFallbackRootEditableFn = ({
  snapshotSchema,
}: CreateFallbackRootEditableFnParams): CreateFallbackRootEditable => {
  const createFallbackRootEditable: CreateFallbackRootEditable = ({ storedSnapshotFailed }) => {
    if (storedSnapshotFailed) {
      console.warn("Snapshot validation failed.", storedSnapshotFailed.reason);
    }

    const [type] = snapshotSchema.root.types;

    const rootEditable = createRoot({ type });

    return {
      rootEditable,
      glyphFormatterInlineTagsOrder: [...glyphFormatterInlineTagsOrder],
    };
  };

  return createFallbackRootEditable;
};

/*
 * Creates the engine with the given snapshot once it's migrated and validated, or with a new root if it can't be
 * loaded. Returns why it couldn't be loaded, if it was given.
 */
export const createCore = ({
  licenseKey,
  storedSnapshot,
  snapshotSchema,
  styles,
}: CreateCoreParams): CreateCoreResult => {
  ensureSanitizerConfigured();

  const { resolvedStoredSnapshot, resolvedStoredSnapshotFailed } = resolveInitialStoredSnapshot({
    storedSnapshot,
    snapshotSchema,
  });

  const createFallbackRootEditable = createFallbackRootEditableFn({ snapshotSchema });

  const { editorAPI } = createEditorAPI({
    licenseKey,
    storedSnapshot: resolvedStoredSnapshot,
    limits: snapshotSchema.limits,
    createFallbackRootEditable,
    shadowRootOptions: {
      mode: "open",
      serializable: true,
      slotAssignment: "manual",
    },
  });

  editorAPI.host.classList.add("editor-host");

  const editorStyleText = buildEditorStyleText(styles);

  editorAPI.replaceCustomStyles(editorStyleText);

  return { editorAPI, storedSnapshotFailed: resolvedStoredSnapshotFailed };
};
