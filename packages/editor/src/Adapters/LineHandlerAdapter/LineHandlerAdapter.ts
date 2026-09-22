import { componentsName } from "#engine-links";
import { extendObjectProperties } from "#utilities";
import {
	createDuplicatePort,
	createEmitter,
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
	const turnIntoAvailabilityUpdateEmitter =
		createEmitter<OnTurnIntoAvailabilityUpdateCallbackFn>();
	const canRemoveUpdateEmitter = createEmitter<OnCanRemoveUpdateCallbackFn>();
	const canDuplicateUpdateEmitter =
		createEmitter<OnCanDuplicateUpdateCallbackFn>();
	const canUnwrapUpdateEmitter = createEmitter<OnCanUnwrapUpdateCallbackFn>();

	// CommandListeners
	const dragStartEmitter = createEmitter<OnDragStartCallbackFn>();
	const turnIntoEmitter = createEmitter<OnTurnIntoCallbackFn>();

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

			turnIntoAvailabilityUpdateEmitter.emit(internals.turnIntoAvailability);
		}

		if (canRemove !== undefined) {
			internals.canRemove = canRemove;

			canRemoveUpdateEmitter.emit(internals.canRemove);
		}

		if (canDuplicate !== undefined) {
			internals.canDuplicate = canDuplicate;

			canDuplicateUpdateEmitter.emit(internals.canDuplicate);
		}

		if (canUnwrap !== undefined) {
			internals.canUnwrap = canUnwrap;

			canUnwrapUpdateEmitter.emit(internals.canUnwrap);
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
				return dragStartEmitter.subscribe(callback);
			},

			onTurnInto(callback) {
				return turnIntoEmitter.subscribe(callback);
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
				return turnIntoAvailabilityUpdateEmitter.subscribe(callback);
			},

			onCanRemoveUpdate(callback) {
				return canRemoveUpdateEmitter.subscribe(callback);
			},

			onCanDuplicateUpdate(callback) {
				return canDuplicateUpdateEmitter.subscribe(callback);
			},

			onCanUnwrapUpdate(callback) {
				return canUnwrapUpdateEmitter.subscribe(callback);
			},

			dragStart(dragEvent) {
				dragStartEmitter.emit(dragEvent);
			},

			turnInto(params) {
				turnIntoEmitter.emit(params);
			},
		} satisfies LineHandlerPublicPortProps,
	);

	return { configPort, publicPort };
};
