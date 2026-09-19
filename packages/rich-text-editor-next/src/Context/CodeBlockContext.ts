import type { CodeBlockTheme } from "@rangex/editor";
import { createContext } from "solid-js";

export interface CodeBlockLanguageOption {
	label: string;
	value: string | null;
}

export interface CodeBlockThemeOption {
	label: string;
	value: string | null;
}

export interface CodeBlockOptions {
	languages?: CodeBlockLanguageOption[];
	themes?: CodeBlockThemeOption[];
	defaultLanguage?: string;
	defaultTheme?: CodeBlockTheme;
}

export const CodeBlockContext = createContext<CodeBlockOptions>();
