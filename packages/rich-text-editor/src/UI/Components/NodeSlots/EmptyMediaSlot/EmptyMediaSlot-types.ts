import type {
	MediaResolveDetail,
	UploadState,
} from "../../../NodeSlotControllers";

export interface EmptyMediaSlotProps {
	onResolve: (detail: MediaResolveDetail) => void;
	uploadState: UploadState;
}
