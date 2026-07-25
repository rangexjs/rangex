// Anchor
export interface AnchorToolbarButtonState {
	disabled: boolean;
	checked: boolean;
}

// CustomComponent
export type CustomComponentName = string;

export interface CustomComponentToolbarButtonState {
	disabled: boolean;
}

// Media
export interface MediaToolbarButtonState {
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
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	date: string | null;
}

export interface TemplateVariableToolbarButtonState {
	disabled: boolean;
	options: TemplateVariableOptions;
}
