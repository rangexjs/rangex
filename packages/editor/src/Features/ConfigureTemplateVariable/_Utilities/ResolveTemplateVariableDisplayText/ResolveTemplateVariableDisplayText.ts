import { assertNever } from "#utilities";
import type { ResolveTemplateVariableDisplayTextParams } from "./ResolveTemplateVariableDisplayText-types";

/*
 * Resolves the display text for a template variable of the given type from the stored values,
 * falling back to a placeholder label like "{{Full name}}" when the value isn't set.
 */
export const resolveTemplateVariableDisplayText = ({
	type,
	storage,
}: ResolveTemplateVariableDisplayTextParams): string => {
	if (type === "full-name") {
		const parts = [storage.firstName, storage.lastName]
			.filter(Boolean)
			.join(" ");

		return parts || "{{Full name}}";
	}

	if (type === "first-name") {
		return storage.firstName ?? "{{First name}}";
	}

	if (type === "last-name") {
		return storage.lastName ?? "{{Last name}}";
	}

	if (type === "email") {
		return storage.email ?? "{{Email}}";
	}

	if (type === "date") {
		return storage.date ?? "{{Date}}";
	}

	return assertNever(type);
};
