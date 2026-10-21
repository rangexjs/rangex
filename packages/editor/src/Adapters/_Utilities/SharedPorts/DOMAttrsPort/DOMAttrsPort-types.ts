import type {
	ComponentAttrs,
	ComponentAttrsMismatch,
	ComponentAttrsPatch,
	ComponentAttrsShape,
} from "#dom-attrs";

export type ValidateDOMAttrsResult<TShape extends ComponentAttrsShape> =
	ComponentAttrsMismatch<TShape> | null;

export type ChangeDOMAttrsResult<TShape extends ComponentAttrsShape> =
	ComponentAttrsMismatch<TShape> | null;

export type OnDOMAttrsUpdateCallbackFn<TShape extends ComponentAttrsShape> = (
	domAttrs: ComponentAttrs<TShape> | null,
) => void;

export type ValidateDOMAttrsProviderFn<TShape extends ComponentAttrsShape> = (
	domAttrs: ComponentAttrs<TShape>,
) => ValidateDOMAttrsResult<TShape>;

export type ChangeDOMAttrsProviderFn<TShape extends ComponentAttrsShape> = (
	patch: ComponentAttrsPatch<TShape>,
) => ChangeDOMAttrsResult<TShape>;

export interface DOMAttrsInternals<TShape extends ComponentAttrsShape> {
	validateDOMAttrsProvider: ValidateDOMAttrsProviderFn<TShape> | null;
	changeDOMAttrsProvider: ChangeDOMAttrsProviderFn<TShape> | null;
}

export interface DOMAttrsConfigPort<TShape extends ComponentAttrsShape> {
	readonly domAttrs: ComponentAttrs<TShape> | null;

	updateDOMAttrs(domAttrs: ComponentAttrs<TShape> | null): void;

	registerValidateDOMAttrs(provider: ValidateDOMAttrsProviderFn<TShape>): void;
	registerChangeDOMAttrs(provider: ChangeDOMAttrsProviderFn<TShape>): void;
}

export interface DOMAttrsPublicPort<TShape extends ComponentAttrsShape> {
	readonly domAttrs: ComponentAttrs<TShape> | null;

	onDOMAttrsUpdate(callback: OnDOMAttrsUpdateCallbackFn<TShape>): () => void;

	validateDOMAttrs(
		domAttrs: ComponentAttrs<TShape>,
	): ValidateDOMAttrsResult<TShape>;
	changeDOMAttrs(
		patch: ComponentAttrsPatch<TShape>,
	): ChangeDOMAttrsResult<TShape>;
}

export interface DOMAttrsPort<TShape extends ComponentAttrsShape> {
	configPort: DOMAttrsConfigPort<TShape>;
	publicPort: DOMAttrsPublicPort<TShape>;
}

export interface CreateDOMAttrsPortResult<TShape extends ComponentAttrsShape>
	extends DOMAttrsPort<TShape> {}
