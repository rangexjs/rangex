import { EmptyMediaSlot } from "../../Components/NodeSlots";
import { createSlotMount } from "../_Utilities";
import type {
	DisposeParams,
	EmptyMediaSlotPublicAPI,
	MountParams,
	MountResult,
	OnResolveFn,
	UpdateParams,
} from "./EmptyMediaSlotController-types";

/**
 * Manages potentially many concurrent empty-media UI mounts — one per `mount()` call, tracked
 * internally by the `container` passed into it. `update`/`dispose` are keyed by that same
 * `container` rather than returned from `mount()`, since callers already have `container` in
 * hand (they created it) and it's exactly what `onResolve`'s payload carries back too.
 */
export class EmptyMediaSlotController {
	#mounts: Map<HTMLElement, MountResult> = new Map();
	#resolveListeners: Set<OnResolveFn> = new Set();

	mount({ container }: MountParams) {
		const { dispose, update } = createSlotMount({
			component: EmptyMediaSlot,
			container,
			initialProps: {
				uploadState: { status: "idle" },
				onResolve: (detail) => {
					for (const listener of this.#resolveListeners) {
						listener({ container, detail });
					}
				},
			},
		});

		this.#mounts.set(container, {
			dispose,
			update: (uploadState) => update({ uploadState }),
		});
	}

	/**
	 * A pending upload's progress/completion callback can still fire after its mount was
	 * disposed elsewhere (e.g. the block was deleted mid-upload) — silently ignored rather
	 * than thrown, since that's an expected race, not an invariant violation.
	 */
	update({ container, uploadState }: UpdateParams) {
		const mount = this.#mounts.get(container);

		mount?.update(uploadState);
	}

	dispose({ container }: DisposeParams) {
		const mount = this.#mounts.get(container);

		if (!mount) {
			throw new Error("No mount found for the given container.");
		}

		mount.dispose();
		this.#mounts.delete(container);
	}

	onResolve(callback: OnResolveFn) {
		this.#resolveListeners.add(callback);

		return () => {
			this.#resolveListeners.delete(callback);
		};
	}

	get publicAPI(): EmptyMediaSlotPublicAPI {
		return {
			mount: (params) => this.mount(params),
			update: (params) => this.update(params),
			dispose: (params) => this.dispose(params),
			onResolve: (callback) => this.onResolve(callback),
		};
	}
}
