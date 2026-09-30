import type { GetTemplateVariableDisplayTextParams } from "./GetTemplateVariableDisplayText-types";

/*
 * Returns the display text of a template variable, which is its field's stored value.
 * Warns and returns null if the display text can't be resolved (e.g. undeclared field, missing stored value).
 */
export const getTemplateVariableDisplayText = ({
	fieldName,
	fieldsConfig,
	storage,
}: GetTemplateVariableDisplayTextParams): string | null => {
	if (!Object.hasOwn(fieldsConfig, fieldName)) {
		console.warn(`Template variable field "${fieldName}" is not declared.`);
		return null;
	}

	const displayText = storage[fieldName];

	if (!displayText) {
		console.warn(
			`Template variable field "${fieldName}" has no stored value to display.`,
		);
		return null;
	}

	return displayText;
};
