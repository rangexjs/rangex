import type {
	AdapterBlueprint,
	Extension,
	ExtensionDefinition,
	ExtensionName,
} from "#ports";

/**
 * `createAdapter` must be called exactly once per editor instance — the driver threads
 * that same adapter into both the UI mount point and `configure`.
 */
export const createExtension = <
	Name extends ExtensionName,
	Options extends object,
	UIPort extends object,
	EditorPort extends object,
	Adapter extends AdapterBlueprint<Options, UIPort, EditorPort>,
>(
	definition: ExtensionDefinition<Name, Options, UIPort, EditorPort, Adapter>,
) => {
	return (
		settings?: Partial<Options>,
	): Extension<Name, Options, UIPort, EditorPort, Adapter> => {
		const mergedSettings = { ...definition.defaultSettings, ...settings };

		return {
			name: definition.name,
			createAdapter: (options) =>
				definition.createAdapter(mergedSettings, options),
			configure: definition.configure,
			components: definition.components,
		};
	};
};
