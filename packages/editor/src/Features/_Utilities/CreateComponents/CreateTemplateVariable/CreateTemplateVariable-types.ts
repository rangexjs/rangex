import type { InlineComponent } from "@rangex/core";

export interface CreateTemplateVariableParams {
	fieldName: string;
	displayText: string;
}

export type CreateTemplateVariableResult = InlineComponent;
