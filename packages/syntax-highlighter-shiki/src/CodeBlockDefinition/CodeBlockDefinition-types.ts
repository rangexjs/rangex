import type { LanguageInput, ThemeInput } from "@shikijs/types";
import type { BundledLanguage, BundledTheme } from "shiki";

export interface CodeBlockLanguageDefinition {
	id: BundledLanguage;
	label: string;
	load: LanguageInput;
}

export interface CodeBlockThemeDefinition {
	id: BundledTheme;
	label: string;
	load: ThemeInput;
}
