import type {
	EmbedEmitSwapParams,
	EmbedSwapCheckState,
	EmbedSwapPopover,
	OnEmbedSwapCheckStateChangeFn,
	OnEmbedSwapFn,
} from "./EmbedSwapPopoverController-types";

export class EmbedSwapPopoverController {
	#popover: HTMLDivElement | null = null;
	#checkState: EmbedSwapCheckState = { status: "idle" };

	#onSwapListeners: Set<OnEmbedSwapFn> = new Set();
	#onCheckStateChangeListeners: Set<OnEmbedSwapCheckStateChangeFn> = new Set();

	emitSwap(params: EmbedEmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	updateCheckState(state: EmbedSwapCheckState) {
		this.#checkState = state;

		for (const listener of this.#onCheckStateChangeListeners) {
			listener(this.#checkState);
		}
	}

	onCheckStateChange(callback: OnEmbedSwapCheckStateChangeFn) {
		this.#onCheckStateChangeListeners.add(callback);
		return () => this.#onCheckStateChangeListeners.delete(callback);
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): EmbedSwapPopover {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			onSwap: (callback) => {
				this.#onSwapListeners.add(callback);
				return () => this.#onSwapListeners.delete(callback);
			},

			updateCheckState: (state) => this.updateCheckState(state),

			onCheckStateChange: (callback) => this.onCheckStateChange(callback),
		};
	}
}
