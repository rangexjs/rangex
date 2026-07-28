import type {
	AdapterBlueprint,
	Extension,
	ExtensionDefinition,
	GetSettings,
} from "#ports";

/**
 * `createAdapter` must be called exactly once per editor instance — the driver threads
 * that same adapter into both the UI mount point and `configure`.
 */
export const createExtension = <Adapter extends AdapterBlueprint>(
	definition: ExtensionDefinition<Adapter>,
) => {
	return (settings?: Partial<GetSettings<Adapter>>): Extension<Adapter> => {
		const mergedSettings = { ...definition.defaultSettings, ...settings };

		return {
			createAdapter: (options) =>
				definition.createAdapter(mergedSettings, options),
			configure: definition.configure,
			components: definition.components,
		};
	};
};
