import { templateVariableId } from "../../../Constants";
import type {
	CreateTemplateVariableNodeDataParams,
	CreateTemplateVariableNodeDataResult,
	EnsureTemplateVariableStorageParams,
	EnsureTemplateVariableStorageResult,
	TemplateVariableNodeData,
	TemplateVariableStore,
} from "./TemplateVariableStorage-types";

/**
 * Guards $$customStorage on an InlineNestedContext node — used to skip unrelated nodes during update passes.
 */
export const validateTemplateVariableNodeData = (
	data: unknown,
): data is TemplateVariableNodeData => {
	const isValid =
		typeof data === "object" &&
		data !== null &&
		"id" in data &&
		data.id === templateVariableId;

	if (!isValid) {
		console.warn(
			"validateTemplateVariableNodeData: unexpected data shape",
			data,
		);
	}

	return isValid;
};

/**
 * Produces the $$customStorage object passed to createInlineNestedContext when inserting a node.
 */
export const createTemplateVariableNodeData = ({
	type,
}: CreateTemplateVariableNodeDataParams): CreateTemplateVariableNodeDataResult => {
	return { id: templateVariableId, type };
};

export const templateVariableKeys = [
	"firstName",
	"lastName",
	"email",
	"date",
] as const;

/**
 * Initializes missing keys to null so the store is always fully populated before reads.
 */
export const ensureTemplateVariableStorage = ({
	rootEditableStorage,
}: EnsureTemplateVariableStorageParams): EnsureTemplateVariableStorageResult => {
	const { templateVariable } = rootEditableStorage;

	for (const key of templateVariableKeys) {
		templateVariable[key] ??= null;
	}

	return templateVariable as unknown as TemplateVariableStore;
};
