import type { TemplateVariableKind } from "@rangex/rich-text-editor-ui";
import type { RootEditableStorage } from "../../../_Utilities";
import type { templateVariableKeys } from "./TemplateVariableStorage";

type TemplateVariableValue = string | null;

export type TemplateVariableKeys = (typeof templateVariableKeys)[number];

// Shared store on RootEditable — single source of truth for all variable values.
export type TemplateVariableStore = {
	[K in TemplateVariableKeys]: TemplateVariableValue;
};

// Stored on each InlineNestedContext node via $$customStorage.
// Identifies which variable type the node represents so update passes know which display text to render.
export interface TemplateVariableNodeData {
	id: "template-variable";
	type: TemplateVariableKind;
}

export interface CreateTemplateVariableNodeDataParams {
	type: TemplateVariableKind;
}

export interface CreateTemplateVariableNodeDataResult
	extends TemplateVariableNodeData {}

export interface EnsureTemplateVariableStorageParams {
	rootEditableStorage: RootEditableStorage;
}

export interface EnsureTemplateVariableStorageResult
	extends TemplateVariableStore {}
