export interface Emitter<Fn extends (...params: never[]) => void> {
	subscribe(callback: Fn): () => void;
	emit(...params: Parameters<Fn>): void;
}

/*
 * Creates a Set-backed emitter for one callback type: subscribe returns its own unsubscribe,
 * emit calls every subscribed callback.
 */
export const createEmitter = <
	Fn extends (...params: never[]) => void,
>(): Emitter<Fn> => {
	const listeners = new Set<Fn>();

	return {
		subscribe(callback) {
			listeners.add(callback);
			return () => listeners.delete(callback);
		},

		emit(...params) {
			for (const listener of listeners) {
				listener(...params);
			}
		},
	};
};
