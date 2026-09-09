import type { CreateAdapterParams } from "../_Utilities";

export interface MarkdownConfigPortProps {}

export interface MarkdownConfigPort extends MarkdownConfigPortProps {}

export interface MarkdownPublicPortProps {}

export interface MarkdownPublicPort extends MarkdownPublicPortProps {}

export interface MarkdownAdapter {
	configPort: MarkdownConfigPort;
	publicPort: MarkdownPublicPort;
}

export interface MarkdownSettings {}

export interface CreateMarkdownAdapterParams
	extends CreateAdapterParams<MarkdownSettings> {}

export interface CreateMarkdownAdapterResult extends MarkdownAdapter {}
