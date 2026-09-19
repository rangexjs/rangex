import { componentsName } from "#engine-links";
import { extendObjectProperties } from "#utilities";
import {
	createDuplicatePort,
	createInsertRootLinePort,
	createRemovePort,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CreateLineHandlerAdapterParams,
	CreateLineHandlerAdapterResult,
	LineHandlerConfigPort,
	LineHandlerConfigPortProps,
	LineHandlerInternals,
	LineHandlerPublicPort,
	LineHandlerPublicPortProps,
	OnCanDuplicateUpdateCallbackFn,
	OnCanRemoveUpdateCallbackFn,
	OnCanUnwrapUpdateCallbackFn,
	OnDragStartCallbackFn,
	OnTurnIntoAvailabilityUpdateCallbackFn,
	OnTurnIntoCallbackFn,
	UpdateStateParams,
} from "./LineHandlerAdapter-types";

export const createLineHandlerAdapter = (
	...params: CreateLineHandlerAdapterParams
): CreateLineHandlerAdapterResult => {
	const [_settings, { floatingContainer }] = params;

	const element = document.createElement("div");
	floatingContainer.append(element);

	const internals: LineHandlerInternals = {
		// States
		turnIntoAvailability: {
			[componentsName.accordionItem]: false,
			[componentsName.blockQuote]: false,
			[componentsName.codeBlock]: false,
			[componentsName.list]: false,
			[componentsName.todoList]: false,
		},
		canRemove: true,
		canDuplicate: true,
		canUnwrap: false,
	};

	// StateListeners
	const onTurnIntoAvailabilityUpdateListeners: Set<OnTurnIntoAvailabilityUpdateCallbackFn> =
		new Set();
	const onCanRemoveUpdateListeners: Set<OnCanRemoveUpdateCallbackFn> =
		new Set();
	const onCanDuplicateUpdateListeners: Set<OnCanDuplicateUpdateCallbackFn> =
		new Set();
	const onCanUnwrapUpdateListeners: Set<OnCanUnwrapUpdateCallbackFn> =
		new Set();

	// CommandListeners
	const onDragStartListeners: Set<OnDragStartCallbackFn> = new Set();
	const onTurnIntoListeners: Set<OnTurnIntoCallbackFn> = new Set();

	const removePort = createRemovePort();
	const unwrapPort = createUnwrapPort();
	const duplicatePort = createDuplicatePort();
	const insertRootLinePort = createInsertRootLinePort();

	const updateState = ({
		turnIntoAvailability,
		canRemove,
		canDuplicate,
		canUnwrap,
	}: UpdateStateParams) => {
		if (turnIntoAvailability !== undefined) {
			internals.turnIntoAvailability = turnIntoAvailability;

			for (const listener of onTurnIntoAvailabilityUpdateListeners) {
				listener(internals.turnIntoAvailability);
			}
		}

		if (canRemove !== undefined) {
			internals.canRemove = canRemove;

			for (const listener of onCanRemoveUpdateListeners) {
				listener(internals.canRemove);
			}
		}

		if (canDuplicate !== undefined) {
			internals.canDuplicate = canDuplicate;

			for (const listener of onCanDuplicateUpdateListeners) {
				listener(internals.canDuplicate);
			}
		}

		if (canUnwrap !== undefined) {
			internals.canUnwrap = canUnwrap;

			for (const listener of onCanUnwrapUpdateListeners) {
				listener(internals.canUnwrap);
			}
		}
	};

	const configPort: LineHandlerConfigPort = extendObjectProperties(
		removePort.configPort,
		unwrapPort.configPort,
		duplicatePort.configPort,
		insertRootLinePort.configPort,
		{
			get element() {
				return element;
			},

			updateState(params) {
				updateState(params);
			},

			onDragStart(callback) {
				onDragStartListeners.add(callback);
				return () => onDragStartListeners.delete(callback);
			},

			onTurnInto(callback) {
				onTurnIntoListeners.add(callback);
				return () => onTurnIntoListeners.delete(callback);
			},
		} satisfies LineHandlerConfigPortProps,
	);

	const publicPort: LineHandlerPublicPort = extendObjectProperties(
		removePort.publicPort,
		unwrapPort.publicPort,
		duplicatePort.publicPort,
		insertRootLinePort.publicPort,
		{
			get element() {
				return element;
			},

			get turnIntoAvailability() {
				return internals.turnIntoAvailability;
			},

			get canRemove() {
				return internals.canRemove;
			},

			get canDuplicate() {
				return internals.canDuplicate;
			},

			get canUnwrap() {
				return internals.canUnwrap;
			},

			onTurnIntoAvailabilityUpdate(callback) {
				onTurnIntoAvailabilityUpdateListeners.add(callback);
				return () => onTurnIntoAvailabilityUpdateListeners.delete(callback);
			},

			onCanRemoveUpdate(callback) {
				onCanRemoveUpdateListeners.add(callback);
				return () => onCanRemoveUpdateListeners.delete(callback);
			},

			onCanDuplicateUpdate(callback) {
				onCanDuplicateUpdateListeners.add(callback);
				return () => onCanDuplicateUpdateListeners.delete(callback);
			},

			onCanUnwrapUpdate(callback) {
				onCanUnwrapUpdateListeners.add(callback);
				return () => onCanUnwrapUpdateListeners.delete(callback);
			},

			dragStart(dragEvent) {
				for (const listener of onDragStartListeners) {
					listener(dragEvent);
				}
			},

			turnInto(params) {
				for (const listener of onTurnIntoListeners) {
					listener(params);
				}
			},
		} satisfies LineHandlerPublicPortProps,
	);

	return { configPort, publicPort };
};
