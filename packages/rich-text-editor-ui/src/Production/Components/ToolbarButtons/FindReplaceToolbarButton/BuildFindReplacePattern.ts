import type { FindReplacePattern } from "../../../ToolbarButtonProps";

interface BuildFindReplacePatternParams {
	findText: string;
	matchCase: boolean;
	useRegex: boolean;
	wholeWord: boolean;
}

/** Builds a RegExp pattern from find options: handles escaping, word boundaries, and case. */
export const buildFindReplacePattern = ({
	findText,
	matchCase,
	useRegex,
	wholeWord,
}: BuildFindReplacePatternParams): FindReplacePattern => {
	const escaped = useRegex ? findText : RegExp.escape(findText);
	const source = wholeWord ? String.raw`\b${escaped}\b` : escaped;
	const flags = matchCase ? "v" : "iv";

	return { source, flags };
};
