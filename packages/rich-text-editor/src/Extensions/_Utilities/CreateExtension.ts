import type { AdapterBlueprint, Extension, ExtensionDefinition } from "#ports";

/**
 * `createAdapter` must be called exactly once per editor instance — the driver threads
 * that same adapter into both the UI mount point and `configure`, the same way
 * `RichTextEditor` shares one `blockResize`/`blockPopoverAppearanceHandler` across every
 * feature that depends on it.
 */
export const createExtension = <
	Name extends string,
	Options extends object,
	Port extends object,
	Adapter extends AdapterBlueprint<Options, Port>,
>(
	definition: ExtensionDefinition<Name, Options, Port, Adapter>,
) => {
	return (
		settings?: Partial<Options>,
	): Extension<Name, Options, Port, Adapter> => {
		const mergedSettings = { ...definition.defaultSettings, ...settings };

		return {
			name: definition.name,
			createAdapter: () => definition.createAdapter(mergedSettings),
			configure: definition.configure,
			components: definition.components,
		};
	};
};
