import {
	type BlockNestedContext,
	blockNestedContextName,
	isEditorNode,
} from "rich-text-area";
import type {
	BlockPopoverAppearanceHandler,
	BlockPopoverRegistration,
	CreateBlockPopoverAppearanceHandlerParams,
	CreateBlockPopoverAppearanceHandlerResult,
} from "./BlockPopoverAppearanceHandler-types";

/**
 * Centralizes the hover-driven show/hide mechanics shared by every block-level popover
 * (code block options, image options, etc). Each component registers its own popover
 * element, corner position, and two hooks: `canShow` decides whether this registration
 * owns a given hovered block and whether its popover should appear, and the optional
 * `onShow` pushes that block's current state into the popover just before it appears —
 * the popover's content stays entirely owned by the registering component. A short delay
 * before hiding tolerates moving the pointer from the block onto the popover itself.
 *
 * Hiding is gated on two independent signals — `pointerOver` and `focusWithin` — so
 * typing into a field inside the popover (e.g. alt text) keeps it open even while the
 * pointer rests elsewhere. Relocating to a *different* registered block on `pointerenter`
 * is never gated by either signal — hovering a new block always takes over immediately.
 */
export const createBlockPopoverAppearanceHandler = ({
	editorAPI,
}: CreateBlockPopoverAppearanceHandlerParams): CreateBlockPopoverAppearanceHandlerResult => {
	const registrations = new Set<BlockPopoverRegistration>();

	const findRegistration = (blockNestedContext: BlockNestedContext) => {
		for (const registration of registrations) {
			if (registration.canShow({ blockNestedContext })) {
				return registration;
			}
		}

		return null;
	};

	const findCurrentRegistration = (blockNestedContext: BlockNestedContext) => {
		for (const registration of registrations) {
			if (registration.currentBlock === blockNestedContext) {
				return registration;
			}
		}

		return null;
	};

	const scheduleHide = (registration: BlockPopoverRegistration) => {
		if (registration.pointerOver || registration.focusWithin) {
			return;
		}

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
		registration.pointerOver = true;
		cancelHide(registration);

		registration.popover.style.cssText = "";
		registration.popover.style.inset = "auto";
		Object.assign(registration.popover.style, registration.position);

		if (registration.currentBlock === blockNestedContext) {
			return;
		}

		// Only push fresh state when the block actually changes — not on every
		// re-entry into the block that's already showing, which would stomp any
		// in-progress, uncommitted edit inside the popover (e.g. a half-typed
		// alt text draft) with the last-saved value.
		registration.onShow?.({ blockNestedContext });

		registration.currentBlock = blockNestedContext;

		registration.popover.hidePopover();
		registration.popover.showPopover({ source: blockNestedContext });
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

				const registration = findRegistration(currentTarget);

				if (!registration) {
					return;
				}

				showPopover(registration, currentTarget);
			},
		},
	});

	const unsubscribePointerLeave = editorAPI.registerDOMEvent({
		when: ({ element }) => element.$$editorRole === blockNestedContextName,
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

				const registration = findCurrentRegistration(currentTarget);

				if (!registration) {
					return;
				}

				registration.pointerOver = false;
				scheduleHide(registration);
			},
		},
	});

	const blockPopoverAppearanceHandler: BlockPopoverAppearanceHandler = {
		registerComponent({ popover, position, canShow, onShow }) {
			const abortController = new AbortController();
			const { signal } = abortController;

			const registration: BlockPopoverRegistration = {
				popover,
				position,
				canShow,
				onShow,
				currentBlock: null,
				hideTimeoutId: NaN,
				abortController,
				pointerOver: false,
				focusWithin: false,
			};

			registrations.add(registration);

			popover.addEventListener(
				"pointerenter",
				() => {
					registration.pointerOver = true;
					cancelHide(registration);
				},
				{ signal },
			);
			popover.addEventListener(
				"pointerleave",
				() => {
					registration.pointerOver = false;
					scheduleHide(registration);
				},
				{ signal },
			);
			popover.addEventListener(
				"focusin",
				() => {
					registration.focusWithin = true;
					cancelHide(registration);
				},
				{ signal },
			);
			popover.addEventListener(
				"focusout",
				(event) => {
					const { relatedTarget } = event;

					if (
						relatedTarget instanceof Node &&
						popover.contains(relatedTarget)
					) {
						return;
					}

					registration.focusWithin = false;
					scheduleHide(registration);
				},
				{ signal },
			);
			popover.addEventListener(
				"toggle",
				(event) => {
					if (event.newState === "closed") {
						registration.currentBlock = null;
						registration.pointerOver = false;
						registration.focusWithin = false;
					}
				},
				{ signal },
			);

			return {
				getCurrentBlock: () => registration.currentBlock,
				cleanup: () => {
					registration.abortController.abort();
					clearTimeout(registration.hideTimeoutId);
					registrations.delete(registration);
				},
			};
		},

		cleanup() {
			unsubscribePointerEnter();
			unsubscribePointerLeave();

			for (const registration of registrations) {
				registration.abortController.abort();
				clearTimeout(registration.hideTimeoutId);
			}

			registrations.clear();
		},
	};

	return blockPopoverAppearanceHandler;
};
