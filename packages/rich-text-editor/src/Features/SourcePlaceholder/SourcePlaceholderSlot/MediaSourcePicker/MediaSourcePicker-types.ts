import type { MediaType } from "@rangex/editor";
import type { MediaFileType } from "../../_Utilities";

export type MediaTab = "upload" | "link";

export interface MediaSourcePickerProps {
	supportedMediaTypes: MediaType[];
	visible: boolean;
	errorMessage: string | null;
	onSubmitFile: (type: MediaFileType, file: File) => void;
	onSubmitUrl: (url: string) => void;
}
