import type { BlockNestedContext } from "rich-text-area";
import type { BundledLangKeys, BundledThemeKeys } from "../../../Libs";

export interface CodeBlockStorage {
	id: "code-block";
	lang: BundledLangKeys;
	theme: { light: BundledThemeKeys; dark: BundledThemeKeys };
}

export interface CreateCodeBlockStorageParams
	extends Omit<CodeBlockStorage, "id"> {}

export interface CreateCodeBlockStorageResult extends CodeBlockStorage {}

export interface EnsureCodeBlockStorageParams {
	blockNestedContext: BlockNestedContext;
}

export interface EnsureCodeBlockStorageResult extends CodeBlockStorage {}
