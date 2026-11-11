import type { CheckboxErrorRestriction, CheckboxErrorState } from "./Utilities-types";

export const getErrorState = (
	checked: boolean,
	errors: CheckboxErrorRestriction,
): CheckboxErrorState => {
	if (errors.required?.value) {
		const hasError = !checked;
		const message = checked ? null : errors.required.message;

		return { hasError, message };
	}

	return { hasError: false, message: null };
};
