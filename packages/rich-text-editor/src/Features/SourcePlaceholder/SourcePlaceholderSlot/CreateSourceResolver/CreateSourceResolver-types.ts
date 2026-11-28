import type { MediaType, RangeXEditor } from "@rangex/editor";
import type { SourcePlaceholderPublicPort } from "@rangex/editor/source-placeholder";
import type { Accessor } from "solid-js";

import type { SlotStatus, SourcePlaceholderSlotSettings } from "../SourcePlaceholderSlot-types";

export interface CreateSourceResolverParams {
  editor: RangeXEditor;
  sourcePlaceholder: SourcePlaceholderPublicPort;
  container: HTMLDivElement;
  settings: SourcePlaceholderSlotSettings;
}

export interface CreateSourceResolverResult {
  status: Accessor<SlotStatus>;
  resolveFile(type: MediaType, file: File): Promise<void>;
  resolveUrl(url: string): Promise<void>;
}
