import type {
	AllowedNamespaceURI,
	DOMAttrsPublicProps,
	EditorElement,
	EditorElementRole,
} from "@rangex/core";

/*
 * An EditorElement that can have attributes: every kind except ContentLine and GlyphFormatter
 */
export type AttrEditorElement = Extract<EditorElement, DOMAttrsPublicProps>;

/*
 * Whether an element's attribute must always be set
 */
export type AttrRequirement = "required" | "optional";

/*
 * The attributes an element can have, by attribute name. Closed: any other attribute is invalid.
 */
export type ElementAttrsShape = Readonly<Record<string, AttrRequirement>>;

/*
 * The elements of a component that have attributes, by element name (e.g. `{ anchor: { href: "required" } }`)
 */
export type ComponentAttrsShape = Readonly<Record<string, ElementAttrsShape>>;

/*
 * A required attribute is always a string, an optional one is null when it isn't set
 */
export type AttrValue<TRequirement extends AttrRequirement> =
	TRequirement extends "required" ? string : string | null;

type AttrNameByRequirement<
	TElementAttrsShape extends ElementAttrsShape,
	TRequirement extends AttrRequirement,
> = {
	[AttrName in keyof TElementAttrsShape]: TElementAttrsShape[AttrName] extends TRequirement
		? AttrName
		: never;
}[keyof TElementAttrsShape];

/*
 * An element's attributes by its shape: a required attribute must be given, an optional one can be left out
 */
export type ElementAttrs<TElementAttrsShape extends ElementAttrsShape> = {
	[AttrName in AttrNameByRequirement<
		TElementAttrsShape,
		"required"
	>]: AttrValue<"required">;
} & {
	[AttrName in AttrNameByRequirement<
		TElementAttrsShape,
		"optional"
	>]?: AttrValue<"optional">;
};

export type ComponentAttrs<TComponentAttrsShape extends ComponentAttrsShape> = {
	[ElementName in keyof TComponentAttrsShape]: ElementAttrs<
		TComponentAttrsShape[ElementName]
	>;
};

/*
 * Which element it is: its localName and namespaceURI, and its role if it's an EditorElement
 */
export interface ElementDescriptor {
	localName: string;
	namespaceURI: AllowedNamespaceURI;
	editorRole?: EditorElementRole;
}

/*
 * A component's elements that have attributes, by element name
 */
export type ComponentElements<
	TComponentAttrsShape extends ComponentAttrsShape,
> = {
	[ElementName in keyof TComponentAttrsShape]: AttrEditorElement;
};

/*
 * Any element's attributes by attribute name: a string sets the attribute, null (or undefined) means it isn't set
 */
export type AnyElementAttrs = Partial<Record<string, string | null>>;

/*
 * Changes an element's attributes: a string sets the attribute, null removes it, and an attribute left out stays as
 * it is.
 */
export type ElementAttrsPatch<TElementAttrsShape extends ElementAttrsShape> = {
	[AttrName in keyof TElementAttrsShape]?: AttrValue<
		TElementAttrsShape[AttrName]
	>;
};

/*
 * Changes a component's attributes: a string sets the attribute, null removes it, and an element or attribute left
 * out stays as it is.
 */
export type ComponentAttrsPatch<
	TComponentAttrsShape extends ComponentAttrsShape,
> = {
	[ElementName in keyof TComponentAttrsShape]?: ElementAttrsPatch<
		TComponentAttrsShape[ElementName]
	>;
};

interface AttrValidationFailedBase {
	reason: string;
}

/*
 * The invalid value is replaced by the fallback; null removes the attribute
 */
export interface AttrValidationFailedFallback<Value extends string | null>
	extends AttrValidationFailedBase {
	kind: "fallback";
	value: Value;
}

/*
 * The attribute can't be fixed: the element is invalid
 */
export interface AttrValidationFailedReject extends AttrValidationFailedBase {
	kind: "reject";
}

export type AttrValidationFailed<Value extends string | null> =
	| AttrValidationFailedFallback<Value>
	| AttrValidationFailedReject;

export interface ValidateAttrParams {
	value: string;
}

export type ValidateAttrResult<Value extends string | null> =
	AttrValidationFailed<Value> | null;

/*
 * Validates a set attribute's value. Value is the attribute's type, so a required attribute can't fall back to null.
 */
export type ValidateAttrFn<Value extends string | null> = (
	params: ValidateAttrParams,
) => ValidateAttrResult<Value>;

export type ElementAttrValidators<
	TElementAttrsShape extends ElementAttrsShape,
> = {
	[AttrName in keyof TElementAttrsShape]: ValidateAttrFn<
		AttrValue<TElementAttrsShape[AttrName]>
	>;
};

export type ComponentAttrValidators<
	TComponentAttrsShape extends ComponentAttrsShape,
> = {
	[ElementName in keyof TComponentAttrsShape]: ElementAttrValidators<
		TComponentAttrsShape[ElementName]
	>;
};

/*
 * Replaces the validators of a component's attributes, by element and attribute name. Which attributes exist, and
 * which of them are required, is decided by the shape.
 */
export type ComponentAttrValidatorOverrides<
	TComponentAttrsShape extends ComponentAttrsShape,
> = {
	[ElementName in keyof TComponentAttrsShape]?: Partial<
		ElementAttrValidators<TComponentAttrsShape[ElementName]>
	>;
};

/*
 * Any element's validators by attribute name
 */
export type AnyElementAttrValidators = Partial<
	Record<string, ValidateAttrFn<string | null>>
>;

export interface UnknownAttrMismatch {
	kind: "unknown-attr";
	attrName: string;
}

export interface MissingAttrMismatch {
	kind: "missing-attr";
	attrName: string;
}

export interface InvalidAttrMismatch {
	kind: "invalid-attr";
	attrName: string;
	validationFailed: AttrValidationFailed<string | null>;
}

export type ElementAttrsMismatch =
	| UnknownAttrMismatch
	| MissingAttrMismatch
	| InvalidAttrMismatch;

/*
 * A component's failed attributes: the element they belong to, and the mismatch
 */
export interface ComponentAttrsMismatch<
	TComponentAttrsShape extends ComponentAttrsShape,
> {
	elementName: keyof TComponentAttrsShape & string;
	mismatch: ElementAttrsMismatch;
}
