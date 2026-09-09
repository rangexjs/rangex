export const normalizeTemplateVariableValue = (
	value: string,
): string | null => {
	if (value === "") {
		return null;
	}

	return value;
};
