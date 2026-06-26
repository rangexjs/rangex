import type { BlockNestedContext } from "rich-text-area";
import type { CodeBlockId } from "../../../Constants";
import type { BundledLangKeys, DualTheme } from "../../../Libs";

export interface CodeBlockStorage {
	id: CodeBlockId;
	lang: BundledLangKeys;
	theme: DualTheme;
}

export interface CreateCodeBlockStorageParams
	extends Omit<CodeBlockStorage, "id"> {}

export interface CreateCodeBlockStorageResult extends CodeBlockStorage {}

export interface EnsureNodeCodeBlockStorageParams {
	blockNestedContext: BlockNestedContext;
}

export interface EnsureNodeCodeBlockStorageResult extends CodeBlockStorage {}

export interface EnsureCodeBlockStorageResult extends CodeBlockStorage {}
