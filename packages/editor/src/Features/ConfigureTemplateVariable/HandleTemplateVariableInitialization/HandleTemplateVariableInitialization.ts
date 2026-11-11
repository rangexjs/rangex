import { getRootStorage } from "#storage";

import { updateAllTemplateVariableNodes, validateTemplateVariableField } from "../_Utilities";
import type { HandleTemplateVariableInitializationParams } from "./HandleTemplateVariableInitialization-types";

/*
 * Seeds root storage with the initialValue (or placeholder) of every declared field that is unset, i.e. has no stored
 * value or still holds its placeholder (e.g. a loaded template snapshot). A field the storage can't hold (see
 * validateTemplateVariableField) is ignored with a warning. Then refreshes every template variable node's display text,
 * and resets the snapshot timeline so the seeded state becomes the initial one.
 */
export const handleTemplateVariableInitialization = ({
	configPort,
	editorAPI,
}: HandleTemplateVariableInitializationParams) => {
	const { rootEditable } = editorAPI;

	const rootStorage = getRootStorage({ rootEditable });
	const { templateVariable: storage } = rootStorage;

	for (const [name, { placeholder, initialValue }] of Object.entries(configPort.fieldsConfig)) {
		const isFieldSet =
			Object.hasOwn(storage, name) && storage[name] !== "" && storage[name] !== placeholder;

		if (isFieldSet) {
			continue;
		}

		if (initialValue === "") {
			console.warn(
				`Template variable field "${name}": initialValue can't be empty, placeholder is used instead.`,
			);
		}

		const value = initialValue || placeholder;

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
	}

	updateAllTemplateVariableNodes({
		rootEditable,
		storage,
		fieldsConfig: configPort.fieldsConfig,
	});

	configPort.updateState({ fields: { ...storage } });

	editorAPI.flushEditorEvents();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.reset();
};
