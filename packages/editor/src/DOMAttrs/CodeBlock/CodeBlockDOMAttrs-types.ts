import type {
	ComponentAttrs,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
} from "../_Utilities";
import type { codeBlockAttrsShape } from "./CodeBlockDOMAttrs";

export type CodeBlockAttrsShape = typeof codeBlockAttrsShape;

export type CodeBlockAttrs = ComponentAttrs<CodeBlockAttrsShape>;

export type CodeBlockAttrValidators = ComponentAttrValidators<CodeBlockAttrsShape>;

export type CreateCodeBlockAttrValidatorsParams =
	ComponentAttrValidatorOverrides<CodeBlockAttrsShape>;

export type CreateCodeBlockAttrValidatorsResult = CodeBlockAttrValidators;
