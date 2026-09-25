import { extendObjectProperties } from "#utilities";
import type {
	CreateShortcutsAdapterParams,
	CreateShortcutsAdapterResult,
	ShortcutsConfigPort,
	ShortcutsConfigPortProps,
	ShortcutsPublicPort,
	ShortcutsPublicPortProps,
} from "./ShortcutsAdapter-types";

export const createShortcutsAdapter = (
	...params: CreateShortcutsAdapterParams
): CreateShortcutsAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("shortcuts");

	const configPort: ShortcutsConfigPort = extendObjectProperties(
		{},
		{} satisfies ShortcutsConfigPortProps,
	);

	const publicPort: ShortcutsPublicPort = extendObjectProperties(
		{},
		{} satisfies ShortcutsPublicPortProps,
	);

	return { configPort, publicPort };
};
