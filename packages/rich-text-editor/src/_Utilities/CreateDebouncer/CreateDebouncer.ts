import { createSignal, onCleanup } from "solid-js";

interface CreateDebouncerOptions {
	delayInMs: number;
}

/** Delays a callback until calls stop for `delayInMs`; `isScheduled` is true from the first call until the callback has run. */
export const createDebouncer = (options: CreateDebouncerOptions) => {
	let id: number | undefined;

	const [isScheduled, setIsScheduled] = createSignal(false);

	const schedule = (callback: () => void) => {
		setIsScheduled(true);
		clearTimeout(id);

		id = setTimeout(() => {
			try {
				callback();
			} finally {
				setIsScheduled(false);
			}
		}, options.delayInMs);
	};

	onCleanup(() => {
		clearTimeout(id);
	});

	return { isScheduled, schedule };
};
