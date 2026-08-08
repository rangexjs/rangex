import type {
	CheckboxErrorRestriction,
	CheckboxErrorState,
	CheckboxState,
} from "./Utilities-types";

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

/**
 * A field's error should only surface once the user has interacted with
 * it — a required checkbox that's merely unchecked on first render is
 * invalid, but not yet worth showing an error for.
 */
export const shouldShowError = (state: CheckboxState): boolean =>
	state.hasError && state.isDirty;
