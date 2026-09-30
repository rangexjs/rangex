import type { BundledLanguage, BundledTheme } from "shiki";
import type { LanguageInput, ThemeInput } from "shiki/types";

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
