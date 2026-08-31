import type { BlockComponent } from "rich-text-area";
import type { BundledLangKeys, DualTheme } from "#libs";
import type { CodeBlockId } from "../../Constants";
import type { codeBlockStorageVersion } from "./CodeBlockStorage";

export interface CodeBlockStorage {
	id: CodeBlockId;
	version: typeof codeBlockStorageVersion;
	lang: BundledLangKeys;
	theme: DualTheme;
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
