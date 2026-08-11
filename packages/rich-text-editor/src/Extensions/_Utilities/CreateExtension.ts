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
	return (settings: GetSettings<Adapter>): Extension<Adapter> => {
		return {
			createAdapter: (options) => definition.createAdapter(settings, options),
			configure: definition.configure,
			components: definition.components,
		};
	};
};
