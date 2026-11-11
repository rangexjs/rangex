import type {
	ComponentAttrs,
	ComponentAttrsMismatch,
	ComponentAttrsPatch,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
} from "../_Utilities";
import type { linkAttrsShape } from "./LinkDOMAttrs";

export type LinkAttrsShape = typeof linkAttrsShape;

export type LinkAttrs = ComponentAttrs<LinkAttrsShape>;

export type AnchorAttrs = LinkAttrs["anchor"];

export type LinkAttrsPatch = ComponentAttrsPatch<LinkAttrsShape>;

export type LinkAttrValidators = ComponentAttrValidators<LinkAttrsShape>;

export type LinkAttrsMismatch = ComponentAttrsMismatch<LinkAttrsShape>;

export type CreateLinkAttrValidatorsParams = ComponentAttrValidatorOverrides<LinkAttrsShape>;

export type CreateLinkAttrValidatorsResult = LinkAttrValidators;
