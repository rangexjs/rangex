import type { FindReplaceRegExpPattern } from "rich-text-area";

export interface BuildFindReplacePatternParams {
	findText: string;
	matchCase: boolean;
	useRegex: boolean;
	wholeWord: boolean;
}

export type BuildFindReplacePatternResult = FindReplaceRegExpPattern;
