import type { InlineComponent } from "rich-text-area";

export interface CreateTemplateVariableParams {
	fieldName: string;
	displayText: string;
}

export type CreateTemplateVariableResult = InlineComponent;
