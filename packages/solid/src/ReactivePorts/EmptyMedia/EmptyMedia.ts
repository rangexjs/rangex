import type { EmptyMediaPublicPort, UploadState } from "@rangex/editor";
import { type Accessor, createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveEmptyMediaPort } from "./EmptyMedia-types";

export const EmptyMedia = <T extends EmptyMediaPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));

	const uploadStateSignals = new Map<HTMLDivElement, Accessor<UploadState>>();

	const uploadState = (element: HTMLDivElement): Accessor<UploadState> => {
		const cached = uploadStateSignals.get(element);
		if (cached) {
			return cached;
		}

		const [value, setValue] = createSignal(publicPort.getUploadState(element));

		onCleanup(publicPort.onUploadStateUpdate(element, setValue));
		uploadStateSignals.set(element, value);

		return value;
	};

	const port: ReactiveEmptyMediaPort = {
		supportedMediaTypes: publicPort.supportedMediaTypes,

		registerSlottedElement: publicPort.registerSlottedElement,

		canInsert,
		uploadState,

		insert: publicPort.insert,
		resolve: publicPort.resolve,
	};

	return port as FromPublicToReactivePort<T>;
};
