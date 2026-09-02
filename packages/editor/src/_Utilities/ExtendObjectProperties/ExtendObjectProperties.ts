export const extendObjectProperties = <
	Obj extends object,
	T1,
	T2,
	T3,
	T4,
	T5,
	T6,
>(
	obj: Obj,
	props1: T1,
	props2?: T2,
	props3?: T3,
	props4?: T4,
	props5?: T5,
	props6?: T6,
) => {
	const propsList = [props1, props2, props3, props4, props5, props6];

	const knownKeys = new Set<string>(Object.getOwnPropertyNames(obj));

	for (const propsItem of propsList) {
		if (!propsItem) {
			continue;
		}

		const descriptors = Object.getOwnPropertyDescriptors(propsItem);

		for (const key of Object.getOwnPropertyNames(descriptors)) {
			if (knownKeys.has(key)) {
				throw new Error(
					`extendObjectProperties: property "${key}" is already defined.`,
				);
			}

			knownKeys.add(key);
		}

		Object.defineProperties(obj, descriptors);
	}

	return obj as Obj & T1 & T2 & T3 & T4 & T5 & T6;
};
