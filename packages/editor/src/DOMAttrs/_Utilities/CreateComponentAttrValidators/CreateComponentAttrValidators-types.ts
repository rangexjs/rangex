import type {
	ComponentAttrsShape,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
	ElementDescriptor,
	ValidateAttrFn,
} from "../DOMAttrs-types";

export interface CreateSanitizedAttrValidatorParams<Value extends string | null>
	extends ElementDescriptor {
	attrName: string;
	validateAttr: ValidateAttrFn<Value>;
}

export type CreateSanitizedAttrValidatorResult<Value extends string | null> =
	ValidateAttrFn<Value>;

/*
 * The descriptors of a component's elements that have attributes, by element name
 */
export type ComponentElementDescriptors<
	TComponentAttrsShape extends ComponentAttrsShape,
> = {
	[ElementName in keyof TComponentAttrsShape]: ElementDescriptor;
};

export interface CreateComponentAttrValidatorsParams<
	TComponentAttrsShape extends ComponentAttrsShape,
> {
	componentAttrsShape: TComponentAttrsShape;
	elementDescriptors: ComponentElementDescriptors<TComponentAttrsShape>;
	defaultValidators: ComponentAttrValidators<TComponentAttrsShape>;
	validatorOverrides: ComponentAttrValidatorOverrides<TComponentAttrsShape>;
}

export type CreateComponentAttrValidatorsResult<
	TComponentAttrsShape extends ComponentAttrsShape,
> = ComponentAttrValidators<TComponentAttrsShape>;
