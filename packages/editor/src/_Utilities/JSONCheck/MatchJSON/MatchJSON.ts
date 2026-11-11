import { isJSONEqual, isJSONObject } from "../IsJSONEqual";
import type {
	JSONPredicate,
	MatchJSONArrayParams,
	MatchJSONAtParams,
	MatchJSONAtResult,
	MatchJSONObjectParams,
	MatchJSONParams,
	MatchJSONResult,
	OptionalKeyPattern,
} from "./MatchJSON-types";

/*
 * Marks an object pattern's key as optional: `{ target: { [optional]: pattern } }`. The key may be missing from the
 * value, but when it's there, its value must match the pattern. A Symbol, so it can never collide with a key of the
 * matched JSON value.
 */
export const optional = Symbol("optional");

const isOptionalKeyPattern = (pattern: unknown): pattern is OptionalKeyPattern<unknown> => {
	return typeof pattern === "object" && pattern !== null && optional in pattern;
};

const matchJSONArray = ({ value, pattern, path }: MatchJSONArrayParams): MatchJSONAtResult => {
	if (!Array.isArray(value) || value.length !== pattern.length) {
		return { path, kind: "invalid-value" };
	}

	for (let i = 0; i < pattern.length; i++) {
		const itemFailed = matchJSONAt({
			value: value[i],
			pattern: pattern[i],
			path: [...path, i],
		});

		if (itemFailed) {
			return itemFailed;
		}
	}

	return null;
};

const matchJSONObject = ({ value, pattern, path }: MatchJSONObjectParams): MatchJSONAtResult => {
	if (!isJSONObject(value)) {
		return { path, kind: "invalid-value" };
	}

	const valueKeys = Object.keys(value);

	const unknownKey = valueKeys.find((key) => !Object.hasOwn(pattern, key));

	if (unknownKey !== undefined) {
		return { path: [...path, unknownKey], kind: "unknown-key" };
	}

	for (const [key, keyPattern] of Object.entries(pattern)) {
		const keyPath = [...path, key];

		const isOptional = isOptionalKeyPattern(keyPattern);

		if (!Object.hasOwn(value, key)) {
			if (isOptional) {
				continue;
			}

			return { path: keyPath, kind: "missing-key" };
		}

		const valuePattern = isOptional ? keyPattern[optional] : keyPattern;

		const keyFailed = matchJSONAt({
			value: value[key],
			pattern: valuePattern,
			path: keyPath,
		});

		if (keyFailed) {
			return keyFailed;
		}
	}

	return null;
};

const matchJSONAt = ({ value, pattern, path }: MatchJSONAtParams): MatchJSONAtResult => {
	if (typeof pattern === "function") {
		const predicate = pattern as JSONPredicate<unknown>;

		return predicate(value) ? null : { path, kind: "invalid-value" };
	}

	if (Array.isArray(pattern)) {
		return matchJSONArray({ value, pattern, path });
	}

	if (isJSONObject(pattern)) {
		return matchJSONObject({ value, pattern, path });
	}

	return isJSONEqual(value, pattern) ? null : { path, kind: "invalid-value" };
};

/*
 * Matches a JSON value against a pattern, returning the first mismatch or null. In the pattern:
 * - a function is a predicate the value must pass,
 * - an array matches an array of the same length, item by item,
 * - an object matches a plain object: every key of the value must be in the pattern (an unknown key is a mismatch),
 *   and every key of the pattern must be in the value unless it's marked as optional (see optional),
 * - any other value must be JSON-equal to the value (see isJSONEqual).
 */
export const matchJSON = <Value>({ value, pattern }: MatchJSONParams<Value>): MatchJSONResult => {
	return matchJSONAt({ value, pattern, path: [] });
};
