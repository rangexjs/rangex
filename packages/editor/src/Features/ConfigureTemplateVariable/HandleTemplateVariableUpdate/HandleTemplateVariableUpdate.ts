import { getRootStorage } from "#storage";
import { updateAllTemplateVariableNodes } from "../_Utilities";
import type { HandleTemplateVariableUpdateParams } from "./HandleTemplateVariableUpdate-types";

/*
 * Subscribes to value changes, persists them into root storage, refreshes every template variable node's display text
 * to match, and registers a snapshot boundary. Empty values and values for undeclared fields are skipped with a warning;
 * if nothing changed, nothing is updated. Returns a cleanup function.
 */
export const handleTemplateVariableUpdate = ({
	configPort,
	editorAPI,
}: HandleTemplateVariableUpdateParams) => {
	const unsubscribe = configPort.onChangeFields((fields) => {
		const { rootEditable } = editorAPI;

		const rootStorage = getRootStorage({ rootEditable });
		const { templateVariable: storage } = rootStorage;

		let hasChanged = false;

		for (const [name, value] of Object.entries(fields)) {
			if (!Object.hasOwn(configPort.fieldsConfig, name)) {
				console.warn(`Template variable field "${name}" is not declared.`);
				continue;
			}

			if (value === "") {
				console.warn(
					`Template variable field "${name}": value can't be empty, use its placeholder instead.`,
				);
				continue;
			}

			if (storage[name] === value) {
				continue;
			}

			storage[name] = value;
			hasChanged = true;
		}

		if (!hasChanged) {
			return;
		}

		configPort.updateState({ fields: { ...storage } });

		updateAllTemplateVariableNodes({
			rootEditable,
			storage,
			fieldsConfig: configPort.fieldsConfig,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
