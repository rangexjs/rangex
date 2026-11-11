import { isDeepEqual } from "#utilities";

export interface StateEmitter<State> {
	get(): State;
	set(state: State): void;
	subscribe(callback: (state: State) => void): () => void;
}

/*
 * Creates an emitter that holds one state: get returns the current state, set stores it and
 * notifies subscribers only when it differs (isDeepEqual) from the previous one. Subscribing
 * does not replay the current state.
 */
export const createStateEmitter = <State>(initialState: State): StateEmitter<State> => {
	const listeners = new Set<(state: State) => void>();

	let state = initialState;

	return {
		get() {
			return state;
		},

		set(nextState) {
			if (isDeepEqual(state, nextState)) {
				return;
			}

			state = nextState;

			for (const listener of listeners) {
				listener(state);
			}
		},

		subscribe(callback) {
			listeners.add(callback);
			return () => listeners.delete(callback);
		},
	};
};
