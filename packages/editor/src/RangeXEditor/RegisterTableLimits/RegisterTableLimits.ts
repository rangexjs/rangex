import { resolveTableLimits } from "#constants";

import type { RegisterTableLimitsParams } from "./RegisterTableLimits-types";

/*
 * Registers the Table's limits, for its Adapter to read them. Without a table in the given components, nothing is
 * registered, so the Table Adapter fails when it's created.
 */
export const registerTableLimits = ({ adapterBus, components }: RegisterTableLimitsParams) => {
	const { table } = components;

	if (!table) {
		return;
	}

	adapterBus.registerTableLimits(resolveTableLimits(table));
};
