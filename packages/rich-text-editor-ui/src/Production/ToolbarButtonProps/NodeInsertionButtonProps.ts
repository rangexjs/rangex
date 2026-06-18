// Anchor
export interface AnchorToolbarButtonState {
	disabled: boolean;
	checked: boolean;
}

// BlockQuote
export interface BlockQuoteToolbarButtonState {
	disabled: boolean;
}

// CheckboxList
export interface CheckboxListToolbarButtonState {
	disabled: boolean;
}

// CodeBlock
export type CodeBlockLanguage =
	| "JavaScript"
	| "TypeScript"
	| "HTML"
	| "CSS"
	| "React"
	| "Python"
	| "Java"
	| "C"
	| "C++"
	| "C#"
	| "Rust"
	| "Go"
	| "Kotlin"
	| "PHP"
	| "Ruby"
	| "Swift"
	| "Dart"
	| "SQL"
	| "Bash"
	| "Markdown";

export type CodeBlockTheme = "dark-plus" | "light-plus";

export interface CodeBlockToolbarButtonState {
	disabled: boolean;
}

// CustomComponent
export type CustomComponentName = "Carousel" | "Collapsible" | "Page Break";

export interface CustomComponentToolbarButtonState {
	disabled: boolean;
}

// Image
export interface ImageToolbarButtonState {
	disabled: boolean;
}

// OrderedList
export interface OrderedListToolbarButtonState {
	disabled: boolean;
}

// Symbols
export interface SymbolsToolbarButtonState {
	disabled: boolean;
}

// Table
export interface TableToolbarButtonState {
	disabled: boolean;
}

// TemplateVariable
export type TemplateVariableKind =
	| "full-name"
	| "first-name"
	| "last-name"
	| "email"
	| "date";

export interface TemplateVariableOptions {
	name: { firstName: string; lastName: string } | null;
	email: string | null;
	// ISO Format YYYY-MM-DD
	date: `${number}-${number}-${number}` | null;
}

export interface TemplateVariableToolbarButtonState {
	disabled: boolean;
	options: TemplateVariableOptions;
}

// UnorderedList
export interface UnorderedListToolbarButtonState {
	disabled: boolean;
}
