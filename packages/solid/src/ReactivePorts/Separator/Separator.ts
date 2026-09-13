import type { SeparatorPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveSeparatorPort } from "./Separator-types";

export const Separator = <T extends SeparatorPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));

	const port: ReactiveSeparatorPort = {
		canInsert,

		insert: publicPort.insert,
	};

	return port as FromPublicToReactivePort<T>;
};
