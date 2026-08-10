export const cn = (classes: string[]) => classes.join(" ");

export const createDebounce = () => {
	let id: number;

	return (callback: () => void, delayInMs: number) => {
		clearTimeout(id);
		id = setTimeout(callback, delayInMs);
	};
};
