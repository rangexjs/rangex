import type { MediaType, SourceType } from "@rangex/editor";

export type SourceTab = "upload" | "link";

export interface SourcePickerProps {
  supportedSourceTypes: SourceType[];
  visible: boolean;
  errorMessage: string | null;
  onSubmitFile: (type: MediaType, file: File) => void;
  onSubmitUrl: (url: string) => void;
}
