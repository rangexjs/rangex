import type { LineHandlerPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveLineHandlerPort } from "./LineHandler-types";

export const LineHandler = <T extends LineHandlerPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveLineHandlerPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveLineHandlerPort>;
	}

	const [turnIntoAvailability, setTurnIntoAvailability] = createSignal(
		publicPort.turnIntoAvailability,
	);
	const [canRemove, setCanRemove] = createSignal(publicPort.canRemove);
	const [canDuplicate, setCanDuplicate] = createSignal(publicPort.canDuplicate);
	const [canUnwrap, setCanUnwrap] = createSignal(publicPort.canUnwrap);

	onCleanup(publicPort.onTurnIntoAvailabilityUpdate(setTurnIntoAvailability));
	onCleanup(publicPort.onCanRemoveUpdate(setCanRemove));
	onCleanup(publicPort.onCanDuplicateUpdate(setCanDuplicate));
	onCleanup(publicPort.onCanUnwrapUpdate(setCanUnwrap));

	const port: ReactiveLineHandlerPort = {
		element: publicPort.element,

		turnIntoAvailability,
		canRemove,
		canDuplicate,
		canUnwrap,

		dragStart: publicPort.dragStart,
		turnInto: publicPort.turnInto,
		remove: publicPort.remove,
		duplicate: publicPort.duplicate,
		unwrap: publicPort.unwrap,
		insertRootLine: publicPort.insertRootLine,
	};

	return port as PreserveUndefined<T, ReactiveLineHandlerPort>;
};
