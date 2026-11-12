import type {
	ComponentAttrs,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
} from "../_Utilities";
import type { tableAttrsShape } from "./TableDOMAttrs";

export type TableAttrsShape = typeof tableAttrsShape;

export type TableAttrs = ComponentAttrs<TableAttrsShape>;

export type TableAttrValidators = ComponentAttrValidators<TableAttrsShape>;

export type CreateTableAttrValidatorsParams = ComponentAttrValidatorOverrides<TableAttrsShape>;

export type CreateTableAttrValidatorsResult = TableAttrValidators;
