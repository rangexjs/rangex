import {
	type BlockComponent,
	blockComponentName,
	isEditorNode,
} from "rich-text-area";
import type {
	CreateOverlayAppearanceHandlerParams,
	CreateOverlayAppearanceHandlerResult,
	OverlayAppearanceHandler,
	OverlayRegistration,
} from "./OverlayAppearanceHandler-types";

/**
 * Centralizes the hover-driven show/hide mechanics for adapter-owned overlays (image/video/
 * audio/embed attribute popovers, etc — popover-backed or CSS-anchor-positioned, this handler
 * doesn't care which). Each component registers its own overlay element and three hooks:
 * `shouldShow` decides whether this registration owns a given hovered block and whether its
 * overlay should appear, `onShow` pushes that block's current state into the overlay and is
 * responsible for actually showing it, and `onClose` is called instead of hiding the overlay
 * directly — the registrant owns hiding it, which gives it a place to run cleanup exactly at
 * the close point. A short delay before hiding tolerates moving the pointer from the block
 * onto the overlay itself.
 *
 * Hiding is gated on two independent signals — `pointerOver` and `focusWithin` — so
 * typing into a field inside the overlay (e.g. alt text) keeps it open even while the
 * pointer rests elsewhere. Relocating to a *different* registered block on `pointerenter`
 * is never gated by either signal — hovering a new block always takes over immediately.
 */
export const createOverlayAppearanceHandler = ({
	editorAPI,
}: CreateOverlayAppearanceHandlerParams): CreateOverlayAppearanceHandlerResult => {
	const registrations = new Set<OverlayRegistration>();

	const findRegistration = (blockComponent: BlockComponent) => {
		for (const registration of registrations) {
			if (registration.shouldShow({ blockComponent })) {
				return registration;
			}
		}

		return null;
	};

	const findCurrentRegistration = (blockComponent: BlockComponent) => {
		for (const registration of registrations) {
			if (registration.currentBlock === blockComponent) {
				return registration;
			}
		}

		return null;
	};

	const scheduleHide = (registration: OverlayRegistration) => {
		if (registration.pointerOver || registration.focusWithin) {
			return;
		}

		clearTimeout(registration.hideTimeoutId);
		registration.hideTimeoutId = setTimeout(() => {
			const { currentBlock } = registration;

			if (!currentBlock) {
				return;
			}

			registration.onClose({ blockComponent: currentBlock });

			registration.currentBlock = null;
			registration.pointerOver = false;
			registration.focusWithin = false;
		}, 100);
	};

	const cancelHide = (registration: OverlayRegistration) => {
		clearTimeout(registration.hideTimeoutId);
	};

	const showPopover = (
		registration: OverlayRegistration,
		blockComponent: BlockComponent,
	) => {
		registration.pointerOver = true;
		cancelHide(registration);

		// registration.popover.style.cssText = "";
		// registration.popover.style.inset = "auto";
		// Object.assign(registration.popover.style, registration.position);

		if (registration.currentBlock === blockComponent) {
			return;
		}

		// currentBlock is assigned before onShow fires — unlike the old handler this forks
		// from — so a getCurrentBlock() closure read from inside onShow already reports the
		// new block, not the previous one.
		registration.currentBlock = blockComponent;

		// Only push fresh state when the block actually changes — not on every
		// re-entry into the block that's already showing, which would stomp any
		// in-progress, uncommitted edit inside the popover (e.g. a half-typed
		// alt text draft) with the last-saved value. onShow itself is responsible for
		// toggling the popover open (`hidePopover()` then `showPopover({ source })`) once
		// its state push is done.
		registration.onShow({ blockComponent });
	};

	const unsubscribePointerEnter = editorAPI.registerDOMEvent({
		when: ({ element }) => element.$$editorRole === blockComponentName,
		eventListener: {
			type: "pointerenter",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== blockComponentName) {
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
		when: ({ element }) => element.$$editorRole === blockComponentName,
		eventListener: {
			type: "pointerleave",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== blockComponentName) {
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

	const overlayAppearanceHandler: OverlayAppearanceHandler = {
		registerComponent({
			popover,
			extraElements = [],
			position,
			shouldShow,
			onShow,
			onClose,
		}) {
			const abortController = new AbortController();
			const { signal } = abortController;

			const registration: OverlayRegistration = {
				popover,
				position,
				shouldShow,
				onShow,
				onClose,
				currentBlock: null,
				hideTimeoutId: NaN,
				abortController,
				pointerOver: false,
				focusWithin: false,
			};

			registrations.add(registration);

			const trackedElements = [popover, ...extraElements];

			for (const trackedElement of trackedElements) {
				trackedElement.addEventListener(
					"pointerenter",
					() => {
						registration.pointerOver = true;
						cancelHide(registration);
					},
					{ signal },
				);
				trackedElement.addEventListener(
					"pointerleave",
					() => {
						registration.pointerOver = false;
						scheduleHide(registration);
					},
					{ signal },
				);
				trackedElement.addEventListener(
					"focusin",
					() => {
						registration.focusWithin = true;
						cancelHide(registration);
					},
					{ signal },
				);
				trackedElement.addEventListener(
					"focusout",
					(event) => {
						const { relatedTarget } = event;

						if (
							relatedTarget instanceof Node &&
							trackedElements.some((element) => element.contains(relatedTarget))
						) {
							return;
						}

						registration.focusWithin = false;
						scheduleHide(registration);
					},
					{ signal },
				);
			}

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

	return overlayAppearanceHandler;
};
