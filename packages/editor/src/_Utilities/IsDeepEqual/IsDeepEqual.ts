const isPlainObject = (value: object) => {
	const prototype = Object.getPrototypeOf(value);

	return prototype === Object.prototype || prototype === null;
};

const isArrayDeepEqual = (a: unknown[], b: unknown[]) => {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		if (!isDeepEqual(a[i], b[i])) {
			return false;
		}
	}

	return true;
};

const isSetDeepEqual = (a: Set<unknown>, b: Set<unknown>) => {
	if (a.size !== b.size) {
		return false;
	}

	const aValues = Array.from(a.values());
	const bValues = Array.from(b.values());

	return isArrayDeepEqual(aValues, bValues);
};

const isObjectDeepEqual = (
	a: Record<string, unknown>,
	b: Record<string, unknown>,
) => {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (aKeys.length !== bKeys.length) {
		return false;
	}

	for (const key of aKeys) {
		if (!(Object.hasOwn(b, key) && isDeepEqual(a[key], b[key]))) {
			return false;
		}
	}

	return true;
};

/*
 * Structural equality for plain data: primitives compare with Object.is, arrays and Sets item
 * by item in (insertion) order, and plain objects by their own enumerable keys, nested in any
 * combination. Values with different prototypes are never equal.
 *
 * Any other object (DOM Nodes, Map, Date, class instances…) compares by identity only.
 */
export const isDeepEqual = (a: unknown, b: unknown): boolean => {
	if (Object.is(a, b)) {
		return true;
	}

	if (
		typeof a !== "object" ||
		typeof b !== "object" ||
		a === null ||
		b === null
	) {
		return false;
	}

	if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
		return false;
	}

	if (Array.isArray(a)) {
		return isArrayDeepEqual(a, b as unknown[]);
	}

	if (a instanceof Set) {
		return isSetDeepEqual(a, b as Set<unknown>);
	}

	if (isPlainObject(a)) {
		return isObjectDeepEqual(
			a as Record<string, unknown>,
			b as Record<string, unknown>,
		);
	}

	// Not plain data, and Object.is already failed.
	return false;
};
