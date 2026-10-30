import type { MediaType } from "@rangex/editor";

export type MediaTab = "upload" | MediaType;

export interface MediaSourcePickerProps {
	supportedMediaTypes: MediaType[];
	visible: boolean;
	errorMessage: string | null;
	onSubmit: (type: MediaType, src: string | File) => void;
}
