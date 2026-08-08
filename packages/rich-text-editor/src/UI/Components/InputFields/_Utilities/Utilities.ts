import type { InputFieldState } from "./Utilities-types";

/**
 * A field's error should only surface once the user has interacted with
 * it — a field that's merely invalid on first render is invalid, but not
 * yet worth showing an error for.
 */
export const showInputFieldError = (state: InputFieldState): boolean =>
	state.hasError && state.isDirty;
