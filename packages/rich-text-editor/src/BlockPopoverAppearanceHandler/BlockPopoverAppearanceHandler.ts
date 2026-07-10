import {
	type BlockNestedContext,
	blockNestedContextName,
	type EditorElement,
	isEditorNode,
} from "rich-text-area";
import type { ComponentName } from "../Constants";
import type {
	BlockPopoverAppearanceHandler,
	BlockPopoverRegistration,
	CreateBlockPopoverAppearanceHandlerParams,
	CreateBlockPopoverAppearanceHandlerResult,
} from "./BlockPopoverAppearanceHandler-types";

const isRegisteredBlockNestedContext = (
	element: EditorElement,
	registrations: Map<ComponentName, BlockPopoverRegistration>,
) =>
	element.$$editorRole === blockNestedContextName &&
	registrations.has(element.$$componentName as ComponentName);

/**
 * Centralizes the hover-driven show/hide mechanics shared by every block-level popover
 * (code block options, image options, etc). Each component registers its own popover
 * element, corner position, and an optional `onShow` hook to push per-block state into
 * the popover just before it appears — the popover's content stays entirely owned by
 * the registering component. A short delay before hiding tolerates moving the pointer
 * from the block onto the popover itself.
 */
export const createBlockPopoverAppearanceHandler = ({
	editorAPI,
}: CreateBlockPopoverAppearanceHandlerParams): CreateBlockPopoverAppearanceHandlerResult => {
	const registrations = new Map<ComponentName, BlockPopoverRegistration>();

	const scheduleHide = (registration: BlockPopoverRegistration) => {
		clearTimeout(registration.hideTimeoutId);
		registration.hideTimeoutId = setTimeout(() => {
			registration.popover.hidePopover();
		}, 100);
	};

	const cancelHide = (registration: BlockPopoverRegistration) => {
		clearTimeout(registration.hideTimeoutId);
	};

	const showPopover = (
		registration: BlockPopoverRegistration,
		blockNestedContext: BlockNestedContext,
	) => {
		cancelHide(registration);

		registration.onShow?.({ blockNestedContext });

		registration.popover.style.cssText = "";
		registration.popover.style.inset = "auto";
		Object.assign(registration.popover.style, registration.position);

		if (registration.currentBlock === blockNestedContext) {
			return;
		}

		registration.currentBlock = blockNestedContext;

		registration.popover.hidePopover();
		registration.popover.showPopover({ source: blockNestedContext });
	};

	const unsubscribePointerEnter = editorAPI.registerDOMEvent({
		when: ({ element }) =>
			isRegisteredBlockNestedContext(element, registrations),
		eventListener: {
			type: "pointerenter",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== blockNestedContextName) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				const registration = registrations.get(
					currentTarget.$$componentName as ComponentName,
				);

				if (!registration) {
					return;
				}

				showPopover(registration, currentTarget);
			},
		},
	});

	const unsubscribePointerLeave = editorAPI.registerDOMEvent({
		when: ({ element }) =>
			isRegisteredBlockNestedContext(element, registrations),
		eventListener: {
			type: "pointerleave",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== blockNestedContextName) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				const registration = registrations.get(
					currentTarget.$$componentName as ComponentName,
				);

				if (!registration) {
					return;
				}

				scheduleHide(registration);
			},
		},
	});

	const blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler = {
		registerComponent({ componentName, popover, position, onShow }) {
			const abortController = new AbortController();
			const { signal } = abortController;

			const registration: BlockPopoverRegistration = {
				popover,
				position,
				onShow,
				currentBlock: null,
				hideTimeoutId: NaN,
				abortController,
			};

			registrations.set(componentName, registration);

			popover.addEventListener("pointerenter", () => cancelHide(registration), {
				signal,
			});
			popover.addEventListener(
				"pointerleave",
				() => scheduleHide(registration),
				{ signal },
			);
			popover.addEventListener(
				"toggle",
				(event) => {
					if (event.newState === "closed") {
						registration.currentBlock = null;
					}
				},
				{ signal },
			);
		},

		unregisterComponent({ componentName }) {
			const registration = registrations.get(componentName);

			if (!registration) {
				return;
			}

			registration.abortController.abort();
			clearTimeout(registration.hideTimeoutId);
			registrations.delete(componentName);
		},

		getCurrentBlock({ componentName }) {
			const registration = registrations.get(componentName);

			if (!registration) {
				throw new Error("ComponentName is not registered.");
			}

			return registration.currentBlock;
		},

		cleanup() {
			unsubscribePointerEnter();
			unsubscribePointerLeave();

			for (const registration of registrations.values()) {
				registration.abortController.abort();
				clearTimeout(registration.hideTimeoutId);
			}

			registrations.clear();
		},
	};

	return blockPopoverAppearanceHandler;
};
