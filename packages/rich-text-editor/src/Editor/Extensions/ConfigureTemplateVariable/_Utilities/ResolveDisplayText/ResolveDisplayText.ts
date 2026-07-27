import { assertNever } from "#ports";
import type { ResolveTemplateVariableDisplayTextParams } from "./ResolveDisplayText-types";

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
