import type {
	CodeBlockPlacementOption,
	CodeBlockTheme,
	ValidateLanguageResult,
	ValidateThemeResult,
} from "#adapters/CodeBlock";

export interface ValidateCodeBlockLanguageParams {
	language: string | null;
}

export type ValidateCodeBlockLanguageResult = ValidateLanguageResult;

export interface ValidateCodeBlockThemeParams {
	theme: CodeBlockTheme | null;
}

export type ValidateCodeBlockThemeResult = ValidateThemeResult;

export interface ValidateCodeBlockPlacementParams
	extends CodeBlockPlacementOption {}

export interface CodeBlockPlacementMismatch {
	field: "language" | "theme";
	reason: string;
}

export type ValidateCodeBlockPlacementResult =
	CodeBlockPlacementMismatch | null;
