import type { MediaType, SourceType } from "@rangex/editor";

export interface ProbeMediaTypeParams {
  src: string;
  supportedSourceTypes: SourceType[];
  signal?: AbortSignal;
  timeoutMs?: number;
}

export type ProbeMediaTypeResult = Promise<MediaType | null>;
