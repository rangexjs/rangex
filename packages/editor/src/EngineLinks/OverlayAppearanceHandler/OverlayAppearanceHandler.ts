import {
	type BlockComponent,
	blockComponentRole,
	isEditorNode,
} from "rich-text-area";
import type {
	CreateOverlayAppearanceHandlerParams,
	CreateOverlayAppearanceHandlerResult,
	OverlayAppearanceHandler,
	OverlayRegistration,
} from "./OverlayAppearanceHandler-types";

/**
 * Centralizes the hover-driven show/hide mechanics for block-attribute overlays. A component
 * registers its overlay element(s) plus `shouldShow`/`onShow`/`onClose` hooks — the handler
 * decides *when* to show/hide based on pointer/focus activity, the registrant decides *how*.
 *
 * Hiding is gated on `pointerOver`/`focusWithin` so focus or a lingering pointer keeps the
 * overlay open, with a short delay tolerating the move from block to overlay.
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

		if (registration.currentBlock === blockComponent) {
			return;
		}

		registration.currentBlock = blockComponent;

		registration.onShow({ blockComponent });
	};

	const unsubscribePointerEnter = editorAPI.registerDOMEvent({
		when: ({ element }) => element.$$editorRole === blockComponentRole,
		eventListener: {
			type: "pointerenter",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== blockComponentRole) {
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
		when: ({ element }) => element.$$editorRole === blockComponentRole,
		eventListener: {
			type: "pointerleave",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== blockComponentRole) {
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
			shouldShow,
			onShow,
			onClose,
		}) {
			const abortController = new AbortController();
			const { signal } = abortController;

			const registration: OverlayRegistration = {
				popover,
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
