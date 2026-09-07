import type { SeparatorPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveSeparatorPort,
	ReactiveSeparatorResult,
} from "./Separator-types";

export const Separator = (
	publicPort: SeparatorPublicPort,
): ReactiveSeparatorResult => {
	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanInsertUpdate(setCanInsert));

	const port: ReactiveSeparatorPort = {
		raw: publicPort,

		canInsert,

		insert: publicPort.insert,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
