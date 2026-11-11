/*
 * Checks whether a value is a plain object, the only kind of object JSON.parse creates.
 */
export const isJSONObject = (
	value: unknown,
): value is Record<string, unknown> => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);

	return prototype === Object.prototype;
};

const isJSONArrayEqual = (a: unknown[], b: unknown[]) => {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		if (!isJSONEqual(a[i], b[i])) {
			return false;
		}
	}

	return true;
};

const isJSONObjectEqual = (
	a: Record<string, unknown>,
	b: Record<string, unknown>,
) => {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (aKeys.length !== bKeys.length) {
		return false;
	}

	for (const key of aKeys) {
		if (!(Object.hasOwn(b, key) && isJSONEqual(a[key], b[key]))) {
			return false;
		}
	}

	return true;
};

/*
 * Structural equality for JSON values: strings, booleans and null compare with ===, numbers with === too (so 0 and
 * -0 are equal), arrays item by item, and plain objects by their own keys in any order. A value JSON can't hold
 * (undefined, NaN, Infinity, functions, Sets, class instances…) is never equal, not even to itself.
 */
export const isJSONEqual = (a: unknown, b: unknown): boolean => {
	if (typeof a === "string" || typeof a === "boolean" || a === null) {
		return a === b;
	}

	if (typeof a === "number") {
		return Number.isFinite(a) && a === b;
	}

	if (Array.isArray(a)) {
		return Array.isArray(b) && isJSONArrayEqual(a, b);
	}

	if (isJSONObject(a)) {
		return isJSONObject(b) && isJSONObjectEqual(a, b);
	}

	return false;
};
