import type { FileId, SourceType } from "@rangex/editor";
import type { EmbedAttrs } from "@rangex/editor/embed";

export interface SourceResolveDetailSettings {
  // The iframe's other attributes every Embed is inserted with (e.g. its sandbox)
  embedIframeAttrs?: Omit<EmbedAttrs["iframe"], "src">;
}

export interface CreateSourceResolveDetailParams {
  type: SourceType;
  src: string;
  fileId: FileId;
  settings: SourceResolveDetailSettings;
}
