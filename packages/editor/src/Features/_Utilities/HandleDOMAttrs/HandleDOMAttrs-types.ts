import type { Component, EditorAPI } from "@rangex/core";
import type { CurrentComponentConfigPort, DOMAttrsConfigPort } from "#adapters";
import type {
	ComponentAttrs,
	ComponentAttrsShape,
	ComponentAttrValidators,
	ComponentElements,
} from "#dom-attrs";

export type NormalizeDOMAttrsFn<TShape extends ComponentAttrsShape> = (
	domAttrs: ComponentAttrs<TShape>,
) => ComponentAttrs<TShape>;

export type ResolveElementsFn<
	TComponent extends Component,
	TShape extends ComponentAttrsShape,
> = (component: TComponent) => ComponentElements<TShape>;

export interface HandleDOMAttrsParams<
	TComponent extends Component,
	TShape extends ComponentAttrsShape,
> {
	currentComponentPort: CurrentComponentConfigPort<TComponent>;
	domAttrsPort: DOMAttrsConfigPort<TShape>;
	editorAPI: EditorAPI;
	componentAttrsShape: TShape;
	componentAttrValidators: ComponentAttrValidators<TShape>;
	normalizeDOMAttrs?: NormalizeDOMAttrsFn<TShape>;
	resolveElements: ResolveElementsFn<TComponent, TShape>;
}

export type ReadDOMAttrsFn<
	TComponent extends Component,
	TShape extends ComponentAttrsShape,
> = (component: TComponent) => ComponentAttrs<TShape>;

export interface CreateDOMAttrsObserverParams<
	TComponent extends Component,
	TShape extends ComponentAttrsShape,
> {
	domAttrsPort: DOMAttrsConfigPort<TShape>;
	componentAttrsShape: TShape;
	readDOMAttrs: ReadDOMAttrsFn<TComponent, TShape>;
}

export interface CreateDOMAttrsObserverResult<TComponent extends Component> {
	readonly observedComponent: TComponent | null;

	observe(component: TComponent | null): void;
	disconnect(): void;
}

export interface DOMAttrsObserverInternals<TComponent extends Component> {
	observedComponent: TComponent | null;
}
