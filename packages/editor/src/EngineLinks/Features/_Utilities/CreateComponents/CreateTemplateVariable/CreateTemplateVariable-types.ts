import type { InlineComponent } from "rich-text-area";
import type { TemplateVariableKind } from "#adapters/TemplateVariable";

export interface CreateTemplateVariableParams {
	type: TemplateVariableKind;
	displayText: string;
}

export type CreateTemplateVariableResult = InlineComponent;
