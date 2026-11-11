import type { JSONMismatchPath } from "../MatchJSON";
import type {
	FindValueAtPathParams,
	FormatJSONMismatchParams,
	FormatJSONMismatchResult,
} from "./FormatJSONMismatch-types";

const identifierPattern = /^[A-Za-z_$][\w$]*$/;

const maxLength = 64;

/*
 * Walks the value down the path. The path comes from matchJSON on the same value, and isn't a missing key's, so every
 * step is in it.
 */
const findValueAtPath = ({ value, path }: FindValueAtPathParams) => {
	let currentValue = value;

	for (const segment of path) {
		const container = currentValue as Record<string | number, unknown>;

		// An own key only, so a missing key named like an inherited one (e.g. "constructor") still gives undefined
		currentValue = Object.hasOwn(container, segment) ? container[segment] : undefined;
	}

	return currentValue;
};

/*
 * Formats a path, e.g. `domAttrs.href` or `allowedComponents[0]`. Every key is cut to 64 characters, and one that
 * isn't an identifier is escaped like a JSON string.
 */
const formatPath = (path: JSONMismatchPath) => {
	let formattedPath = "";

	for (const segment of path) {
		if (typeof segment === "number") {
			formattedPath += `[${segment}]`;
			continue;
		}

		const cutSegment = segment.slice(0, maxLength);

		if (!identifierPattern.test(cutSegment)) {
			formattedPath += `[${JSON.stringify(cutSegment)}]`;
			continue;
		}

		formattedPath += formattedPath ? `.${cutSegment}` : cutSegment;
	}

	return formattedPath;
};

/*
 * Formats a value as JSON, cut to 64 characters. A string is cut before it's escaped, so a long one isn't escaped as
 * a whole.
 */
const formatValue = (value: unknown) => {
	if (typeof value === "string") {
		const cutValue = value.slice(0, maxLength);

		return JSON.stringify(cutValue);
	}

	const formattedValue = JSON.stringify(value) ?? String(value);

	return formattedValue.slice(0, maxLength);
};

/*
 * Formats a matchJSON mismatch for a message: its path and the value found there, from the value passed to
 * matchJSON, e.g. `content.unwrap: "if-modified"`. Only the path for a missing key, and only the
 * value when the path is empty (the matched value itself). Keys and values are cut to 64 characters and escaped, so a
 * message stays short and on one line whatever the value contains.
 */
export const formatJSONMismatch = ({
	value,
	mismatch,
}: FormatJSONMismatchParams): FormatJSONMismatchResult => {
	const { path, kind } = mismatch;

	const formattedPath = formatPath(path);

	if (kind === "missing-key") {
		return formattedPath;
	}

	const valueAtPath = findValueAtPath({ value, path });

	const formattedValue = formatValue(valueAtPath);

	if (!formattedPath) {
		return formattedValue;
	}

	return `${formattedPath}: ${formattedValue}`;
};
