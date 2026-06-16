import type { BlockNestedContext } from "rich-text-area";
import type { BundledLangKeys, DualTheme } from "../../../Libs";

export interface CodeBlockStorage {
	id: "code-block";
	lang: BundledLangKeys;
	theme: DualTheme;
}

export interface CreateCodeBlockStorageParams
	extends Omit<CodeBlockStorage, "id"> {}

export interface CreateCodeBlockStorageResult extends CodeBlockStorage {}

export interface EnsureCodeBlockStorageParams {
	blockNestedContext: BlockNestedContext;
}

export interface EnsureCodeBlockStorageResult extends CodeBlockStorage {}
