import type {
	ComponentAttrs,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
} from "../_Utilities";
import type { rootAttrsShape } from "./RootDOMAttrs";

export type RootAttrsShape = typeof rootAttrsShape;

export type RootAttrs = ComponentAttrs<RootAttrsShape>;

export type RootAttrValidators = ComponentAttrValidators<RootAttrsShape>;

export type CreateRootAttrValidatorsParams =
	ComponentAttrValidatorOverrides<RootAttrsShape>;

export type CreateRootAttrValidatorsResult = RootAttrValidators;
