import type {
	BuildFindReplacePatternParams,
	BuildFindReplacePatternResult,
} from "./BuildFindReplacePattern-types";

/** Builds a RegExp pattern from find options: handles escaping, word boundaries, and case. */
export const buildFindReplacePattern = ({
	findText,
	matchCase,
	useRegex,
	wholeWord,
}: BuildFindReplacePatternParams): BuildFindReplacePatternResult => {
	const escaped = useRegex ? findText : RegExp.escape(findText);
	const source = wholeWord ? String.raw`\b${escaped}\b` : escaped;
	const flags = matchCase ? "v" : "iv";

	return { source, flags };
};
