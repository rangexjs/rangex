import type { CodeBlockTheme } from "@rangex/editor";
import { createContext } from "solid-js";

// CodeBlock
export interface CodeBlockLanguageOption {
	label: string;
	value: string | null;
}

export interface CodeBlockThemeOption {
	label: string;
	value: string | null;
}

export interface CodeBlockUIOptions {
	languages?: CodeBlockLanguageOption[];
	themes?: CodeBlockThemeOption[];
	defaultLanguage?: string;
	defaultTheme?: CodeBlockTheme;
}

export interface UIOptions {
	codeBlock: CodeBlockUIOptions;
}

export const UIOptionsContext = createContext<UIOptions>();
