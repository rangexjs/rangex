import {
	type BlockNestedContext,
	blockNestedContextName,
	isEditorNode,
} from "rich-text-area";
import type { BlockResizeRegistrationSet } from "../BlockResize-types";
import type { HandleBlockResizeAppearanceParams } from "./HandleBlockResizeAppearance-types";

const findRegistration = (
	blockNestedContext: BlockNestedContext,
	registrations: BlockResizeRegistrationSet,
) => {
	for (const registration of registrations) {
		if (registration.canShow({ blockNestedContext })) {
			return registration;
		}
	}

	return null;
};

/**
 * Shows/hides the block resize handles on pointer hover, mirroring the code block popover's
 * hover behavior. A short delay before hiding tolerates moving the pointer from the block onto
 * the handles themselves.
 */
export const handleBlockResizeAppearance = ({
	blockResizePort,
	editorAPI,
	internals,
}: HandleBlockResizeAppearanceParams) => {
	const { popover } = blockResizePort;

	let hideTimeoutId = NaN;

	const scheduleHide = () => {
		clearTimeout(hideTimeoutId);
		hideTimeoutId = setTimeout(() => {
			popover.hidePopover();
		}, 100);
	};

	const cancelHide = () => {
		clearTimeout(hideTimeoutId);
	};

	const onToggle = (event: ToggleEvent) => {
		if (event.newState === "closed") {
			internals.currentBlock = null;
		}
	};

	const controller = new AbortController();
	const { signal } = controller;

	popover.addEventListener("pointerenter", cancelHide, { signal });
	popover.addEventListener("pointerleave", scheduleHide, { signal });
	popover.addEventListener("toggle", onToggle, { signal });

	const showPopover = (blockNestedContext: BlockNestedContext) => {
		const registration = findRegistration(
			blockNestedContext,
			internals.registrations,
		);

		if (!registration) {
			return;
		}

		cancelHide();

		blockResizePort.updateHandleX(registration.handleX);

		if (internals.currentBlock === blockNestedContext) {
			return;
		}

		internals.currentBlock = blockNestedContext;

		popover.hidePopover();
		popover.showPopover({ source: blockNestedContext });
	};

	const unsubscribePointerEnter = editorAPI.registerDOMEvent({
		when: ({ element }) => element.$$editorRole === blockNestedContextName,
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

				showPopover(currentTarget);
			},
		},
	});

	const unsubscribePointerLeave = editorAPI.registerDOMEvent({
		when: ({ element }) => element.$$editorRole === blockNestedContextName,
		eventListener: {
			type: "pointerleave",
			listener: scheduleHide,
		},
	});

	return () => {
		controller.abort();
		unsubscribePointerEnter();
		unsubscribePointerLeave();
	};
};
