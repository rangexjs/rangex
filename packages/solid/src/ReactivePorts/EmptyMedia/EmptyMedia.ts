import type { EmptyMediaPublicPort, UploadState } from "@rangex/editor";
import { type Accessor, createSignal } from "solid-js";
import type {
	ReactiveEmptyMediaPort,
	ReactiveEmptyMediaResult,
} from "./EmptyMedia-types";

export const EmptyMedia = (
	publicPort: EmptyMediaPublicPort,
): ReactiveEmptyMediaResult => {
	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanInsertUpdate(setCanInsert));

	const uploadStateSignals = new Map<HTMLElement, Accessor<UploadState>>();

	const uploadState = (element: HTMLElement): Accessor<UploadState> => {
		const cached = uploadStateSignals.get(element);
		if (cached) {
			return cached;
		}

		const [value, setValue] = createSignal(publicPort.getUploadState(element));

		unsubscribeList.add(publicPort.onUploadStateUpdate(element, setValue));
		uploadStateSignals.set(element, value);

		return value;
	};

	const port: ReactiveEmptyMediaPort = {
		raw: publicPort,

		supportedMediaTypes: publicPort.supportedMediaTypes,

		canInsert,
		uploadState,

		insert: publicPort.insert,
		resolve: publicPort.resolve,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
