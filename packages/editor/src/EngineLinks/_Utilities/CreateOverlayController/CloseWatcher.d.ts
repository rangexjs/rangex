// Not yet in TypeScript's bundled lib.dom.d.ts.
export {};

declare global {
	interface CloseWatcherOptions {
		signal?: AbortSignal;
	}

	interface CloseWatcher extends EventTarget {
		requestClose(): void;
		close(): void;
		destroy(): void;
		oncancel: ((this: CloseWatcher, event: Event) => void) | null;
		onclose: ((this: CloseWatcher, event: Event) => void) | null;
	}

	const CloseWatcher: {
		prototype: CloseWatcher;
		new (options?: CloseWatcherOptions): CloseWatcher;
	};
}
