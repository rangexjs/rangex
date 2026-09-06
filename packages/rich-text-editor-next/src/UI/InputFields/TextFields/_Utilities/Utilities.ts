import type { JSX } from "@solidjs/web";
import type {
	TextFieldErrorRestriction,
	TextFieldErrorState,
	TextFieldErrorVariant,
} from "./Utilities-types";

const defaultPriority: TextFieldErrorVariant[] = [
	"required",
	"min",
	"max",
	"minlength",
	"maxlength",
	"pattern",
] as const;

/**
 * We check the ErrorVariant if its value is not `undefined`,
 * then set the ErrorState based on the ErrorRestriction.
 *
 * {@link priority} defines which message should be returned if
 * multiple errors were detected.
 */
export const getErrorState = (
	value: string,
	errors: TextFieldErrorRestriction,
): TextFieldErrorState => {
	let hasError = false;

	const messages: Partial<Record<TextFieldErrorVariant, JSX.Element>> = {};

	if (!(errors.required?.value || value)) {
		return { hasError: false, message: null };
	}

	if (errors.min !== undefined && value) {
		if (errors.min.value > +value) {
			hasError = true;
			messages.min = errors.min.message;
		}
	}

	if (errors.max !== undefined && value) {
		if (errors.max.value < +value) {
			hasError = true;
			messages.max = errors.max.message;
		}
	}

	if (errors.maxLength !== undefined) {
		if (errors.maxLength.value < value.length) {
			hasError = true;
			messages.maxlength = errors.maxLength.message;
		}
	}

	if (errors.minLength !== undefined) {
		if (errors.minLength.value > value.length) {
			hasError = true;
			messages.minlength = errors.minLength.message;
		}
	}

	if (errors.patterns !== undefined) {
		const patternError = errors.patterns.find(
			(pattern) => !pattern.value.test(value),
		);

		if (patternError) {
			hasError = true;
			messages.pattern = patternError?.message;
		}
	}

	if (errors.custom !== undefined) {
		const isValidValue = errors.custom.isValid(value);

		if (!isValidValue) {
			hasError = true;
			messages.pattern = errors.custom.message;
		}
	}

	if (errors.required !== undefined) {
		if (errors.required.value && !value) {
			hasError = true;
			messages.required = errors.required.message;
		}
	}

	// Make sure that the priority contains every ErrorVariant
	const priority = [
		...new Set([...(errors.priority ?? []), ...defaultPriority]),
	];

	const messageKey = priority.find((variant) => messages[variant]);

	const message = (messageKey && messages[messageKey]) ?? errors.defaultMessage;

	return { hasError, message };
};
