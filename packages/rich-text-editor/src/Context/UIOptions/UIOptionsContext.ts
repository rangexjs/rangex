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

// Mention
export interface MentionItem {
	userId: string;
	displayName?: string;
	img?: string;
}

export type MentionItems = MentionItem[];

export interface GetMentionItemsParams {
	query: string;
	signal: AbortSignal;
}

export type GetMentionItemsFn = (
	params: GetMentionItemsParams,
) => Promise<MentionItems>;

export interface MentionUIOptions {
	getItems: GetMentionItemsFn;
}

export interface UIOptions {
	codeBlock?: CodeBlockUIOptions;
	mention?: MentionUIOptions;
}

export const UIOptionsContext = createContext<UIOptions>();
