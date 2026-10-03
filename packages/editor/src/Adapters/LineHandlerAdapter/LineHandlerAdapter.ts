import { componentsName } from "#engine-links";
import { extendObjectProperties } from "#utilities";
import {
	createDuplicatePort,
	createEmitter,
	createInsertRootLinePort,
	createRemovePort,
	createStateEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CreateLineHandlerAdapterParams,
	CreateLineHandlerAdapterResult,
	LineHandlerConfigPort,
	LineHandlerConfigPortProps,
	LineHandlerPublicPort,
	LineHandlerPublicPortProps,
	OnDragStartCallbackFn,
	OnTurnIntoCallbackFn,
	TurnIntoAvailability,
	UpdateStateParams,
} from "./LineHandlerAdapter-types";

export const createLineHandlerAdapter = (
	...params: CreateLineHandlerAdapterParams
): CreateLineHandlerAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("lineHandler");

	const element = document.createElement("div");
	floatingContainer.append(element);

	// States
	const turnIntoAvailabilityState = createStateEmitter<TurnIntoAvailability>({
		[componentsName.accordionItem]: false,
		[componentsName.blockQuote]: false,
		[componentsName.codeBlock]: false,
		[componentsName.list]: false,
		[componentsName.todoList]: false,
	});
	const canRemoveState = createStateEmitter<boolean>(true);
	const canDuplicateState = createStateEmitter<boolean>(true);
	const canUnwrapState = createStateEmitter<boolean>(false);

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
			turnIntoAvailabilityState.set(turnIntoAvailability);
		}

		if (canRemove !== undefined) {
			canRemoveState.set(canRemove);
		}

		if (canDuplicate !== undefined) {
			canDuplicateState.set(canDuplicate);
		}

		if (canUnwrap !== undefined) {
			canUnwrapState.set(canUnwrap);
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
				return turnIntoAvailabilityState.get();
			},

			get canRemove() {
				return canRemoveState.get();
			},

			get canDuplicate() {
				return canDuplicateState.get();
			},

			get canUnwrap() {
				return canUnwrapState.get();
			},

			onTurnIntoAvailabilityUpdate(callback) {
				return turnIntoAvailabilityState.subscribe(callback);
			},

			onCanRemoveUpdate(callback) {
				return canRemoveState.subscribe(callback);
			},

			onCanDuplicateUpdate(callback) {
				return canDuplicateState.subscribe(callback);
			},

			onCanUnwrapUpdate(callback) {
				return canUnwrapState.subscribe(callback);
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
