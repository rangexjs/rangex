const dataPrefix = "data-er-class";

const readERClasses = (element: HTMLElement) => {
	const value = element.getAttribute(dataPrefix) ?? "";
	const tokens = value.split(" ");
	const nonEmptyTokens = tokens.filter((token) => token !== "");

	return new Set(nonEmptyTokens);
};

const writeERClasses = (element: HTMLElement, erClasses: Set<string>) => {
	const value = [...erClasses].join(" ");

	element.setAttribute(dataPrefix, value);
};

/*
 * Adds tokens to the element's `data-er-class` attribute — the editor's own class list, kept apart from `class`
 * so UI frameworks that own `class` can't overwrite it. Styled via `[data-er-class~="token"]`.
 */
export const addERClass = (element: HTMLElement, ...tokens: string[]) => {
	const erClasses = readERClasses(element);

	for (const token of tokens) {
		erClasses.add(token);
	}

	writeERClasses(element, erClasses);
};

/*
 * Removes tokens from the element's `data-er-class` attribute.
 */
export const removeERClass = (element: HTMLElement, ...tokens: string[]) => {
	const erClasses = readERClasses(element);

	for (const token of tokens) {
		erClasses.delete(token);
	}

	writeERClasses(element, erClasses);
};
