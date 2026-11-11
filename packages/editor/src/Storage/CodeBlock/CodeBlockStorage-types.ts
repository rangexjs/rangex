import type { BlockComponent } from "@rangex/core";
import type { CodeBlockId } from "../_Constants";

export type CodeBlockTheme = {
	light: string;
	dark: string;
};

export type CodeBlockStorage = {
	id: CodeBlockId;
	language: string | null;
	theme: CodeBlockTheme | null;
};

export interface CreateCodeBlockStorageParams
	extends Omit<CodeBlockStorage, "id"> {}

export type CreateCodeBlockStorageResult = CodeBlockStorage;

export interface CodeBlockStorageFallbacks
	extends Omit<CodeBlockStorage, "id"> {}

export interface EnsureCodeBlockStorageParams {
	storage: unknown;
	fallbacks: CodeBlockStorageFallbacks;
}

export type EnsureCodeBlockStorageResult = CodeBlockStorage;

export interface EnsureNodeCodeBlockStorageParams {
	blockComponent: BlockComponent;
	fallbacks: CodeBlockStorageFallbacks;
}

export type EnsureNodeCodeBlockStorageResult = CodeBlockStorage;
