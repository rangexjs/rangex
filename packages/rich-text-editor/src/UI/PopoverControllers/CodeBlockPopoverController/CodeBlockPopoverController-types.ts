import type { CodeBlockLanguage, CodeBlockTheme } from "#ports";

export type UpdateLanguageFn = (value: CodeBlockLanguage) => void;
export type UpdateLightThemeFn = (value: CodeBlockTheme) => void;
export type UpdateDarkThemeFn = (value: CodeBlockTheme) => void;

export type CodeBlockListenerOption =
	| { type: "language"; callback: UpdateLanguageFn }
	| { type: "lightTheme"; callback: UpdateLightThemeFn }
	| { type: "darkTheme"; callback: UpdateDarkThemeFn };

export type CodeBlockUpdateListenerParams = CodeBlockListenerOption & {
	operation: "add" | "delete";
};
