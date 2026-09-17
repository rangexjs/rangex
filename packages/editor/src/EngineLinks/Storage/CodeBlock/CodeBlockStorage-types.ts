import type { BlockComponent } from "rich-text-area";
import type { CodeBlockId } from "../../Constants";
import type { codeBlockStorageVersion } from "./CodeBlockStorage";

export interface CodeBlockTheme {
	light: string;
	dark: string;
}

export interface CodeBlockStorage {
	id: CodeBlockId;
	version: typeof codeBlockStorageVersion;
	language: string | null;
	theme: CodeBlockTheme | null;
}

export interface CreateCodeBlockStorageParams
	extends Omit<CodeBlockStorage, "id" | "version"> {}

export interface CreateCodeBlockStorageResult extends CodeBlockStorage {}

export interface CodeBlockStorageFallbacks
	extends Omit<CodeBlockStorage, "id" | "version"> {}

export interface EnsureCodeBlockStorageParams {
	storage: unknown;
	fallbacks: CodeBlockStorageFallbacks;
}

export interface EnsureCodeBlockStorageResult extends CodeBlockStorage {}

export interface EnsureNodeCodeBlockStorageParams {
	blockComponent: BlockComponent;
	fallbacks: CodeBlockStorageFallbacks;
}

export interface EnsureNodeCodeBlockStorageResult extends CodeBlockStorage {}
