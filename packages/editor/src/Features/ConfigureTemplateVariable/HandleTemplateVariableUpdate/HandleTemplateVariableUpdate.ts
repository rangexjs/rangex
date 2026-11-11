import { getRootStorage } from "#storage";
import {
	updateAllTemplateVariableNodes,
	validateTemplateVariableField,
} from "../_Utilities";
import type { HandleTemplateVariableUpdateParams } from "./HandleTemplateVariableUpdate-types";

/*
 * Subscribes to value changes, persists them into root storage, refreshes every template variable node's display text
 * to match, and registers a snapshot boundary. Undeclared fields and the ones the storage can't hold (see
 * validateTemplateVariableField) are skipped with a warning; if nothing changed, nothing is updated. Returns a cleanup
 * function.
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

			if (storage[name] === value) {
				continue;
			}

			const fieldMismatch = validateTemplateVariableField({
				fieldName: name,
				value,
				storage,
			});

			if (fieldMismatch) {
				console.warn(`Template variable field "${name}":`, fieldMismatch);
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
