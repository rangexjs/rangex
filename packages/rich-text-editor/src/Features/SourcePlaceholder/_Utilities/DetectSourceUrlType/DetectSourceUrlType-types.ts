import type { SourceType, RangeXEditor } from "@rangex/editor";

import type { SourceResolveDetailSettings } from "../CreateSourceResolveDetail";

export interface DetectSourceUrlTypeSettings extends SourceResolveDetailSettings {
  /*
   * Turns a pasted link into the URL to frame if it's one of an embed (e.g. a share link into its embed URL). Every
   * link that isn't a media file by its extension goes through it, so any other link must be returned as it is.
   */
  transformEmbedURL?: (url: string) => string;
}

export interface DetectSourceUrlTypeParams {
  editor: RangeXEditor;
  url: string;
  supportedSourceTypes: SourceType[];
  settings: DetectSourceUrlTypeSettings;
  signal?: AbortSignal;
}

interface FoundSourceUrl {
  status: "found";
  type: SourceType;
  // The URL to insert: the transformed one for an embed
  src: string;
}

export type SourceUrlDetection = FoundSourceUrl | { status: "unknown" };

export type DetectSourceUrlTypeResult = Promise<SourceUrlDetection>;
