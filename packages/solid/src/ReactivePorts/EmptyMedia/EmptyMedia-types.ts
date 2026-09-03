import type { MediaType, ResolveOption, UploadState } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveEmptyMediaPort {
	readonly supportedMediaTypes: MediaType[];

	canInsert: Accessor<boolean>;
	uploadState(element: HTMLElement): Accessor<UploadState>;

	insert(): void;
	resolve(params: ResolveOption): void;
}

export interface ReactiveEmptyMediaResult {
	port: ReactiveEmptyMediaPort;
	dispose: () => void;
}
