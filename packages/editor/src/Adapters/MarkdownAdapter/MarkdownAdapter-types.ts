import type { CreateAdapterParams } from "../_Utilities";
import type { CodeBlockPlacementOption } from "../CodeBlockAdapter";

export interface CodeBlockMarkdownTrigger extends CodeBlockPlacementOption {
	trigger: string;
}

export interface MarkdownConfigPortProps {
	readonly codeBlockTriggers: CodeBlockMarkdownTrigger[];
}

export interface MarkdownConfigPort extends MarkdownConfigPortProps {}

export interface MarkdownPublicPortProps {}

export interface MarkdownPublicPort extends MarkdownPublicPortProps {}

export interface MarkdownInternals {
	codeBlockTriggers: CodeBlockMarkdownTrigger[];
}

export interface MarkdownAdapter {
	configPort: MarkdownConfigPort;
	publicPort: MarkdownPublicPort;
}

export interface MarkdownSettings {
	codeBlockTriggers?: CodeBlockMarkdownTrigger[];
}

export interface CreateMarkdownAdapterParams
	extends CreateAdapterParams<MarkdownSettings> {}

export interface CreateMarkdownAdapterResult extends MarkdownAdapter {}
