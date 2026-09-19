import type { LanguageInput, ThemeInput } from "@shikijs/types";
import type { BundledLanguage, BundledTheme } from "shiki";

export interface CodeBlockLanguageDefinition {
	label: string;
	value: BundledLanguage;
	load: LanguageInput;
}

export interface CodeBlockThemeDefinition {
	label: string;
	value: BundledTheme;
	load: ThemeInput;
}
