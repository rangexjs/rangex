import { todoListCheckboxId } from "../../../Constants";
import type { CheckboxStorage } from "./CheckboxStorage-types";

/**
 * Guards $$customStorage on an HTMLLayout checkbox node — used to skip unrelated nodes.
 */
export const validateCheckboxStorage = (
	data: unknown,
): data is CheckboxStorage => {
	return (
		typeof data === "object" &&
		data !== null &&
		"id" in data &&
		data.id === todoListCheckboxId
	);
};
