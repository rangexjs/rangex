import type { BlockComponent, EditorAPI } from "@rangex/core";

import type { AdapterBus, SourceResolveDetail } from "#adapters";
import type { SourcePlaceholderConfigPort } from "#adapters/SourcePlaceholder";
import type {
  AudioAttrsMismatch,
  EmbedAttrsMismatch,
  ImageAttrsMismatch,
  VideoAttrsMismatch,
} from "#dom-attrs";

export interface WatchSourcePlaceholderParams {
  adapterBus: AdapterBus;
  configPort: SourcePlaceholderConfigPort;
  editorAPI: EditorAPI;
}

export type WatchSourcePlaceholderResult = () => void;

export interface ValidateSourcePlacementParams {
  adapterBus: AdapterBus;
  detail: SourceResolveDetail;
}

export type ValidateSourcePlacementResult =
  | ImageAttrsMismatch
  | VideoAttrsMismatch
  | AudioAttrsMismatch
  | EmbedAttrsMismatch
  | null;

export interface FinalizeResolveParams {
  blockComponent: BlockComponent;
  detail: SourceResolveDetail;
}
