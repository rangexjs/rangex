import type { BlockComponent, ContentFlowNode, EditorAPI, InlineComponent } from "@rangex/core";

import type { BlockComponentName, ComponentName, InlineComponentName } from "#constants";

export type ComponentByName<TName extends ComponentName> = TName extends BlockComponentName
	? BlockComponent
	: TName extends InlineComponentName
		? InlineComponent
		: never;

export interface ClosestParams<TName extends ComponentName> {
	fromNode: ContentFlowNode;
	fromOffset: number;
	toNode: ContentFlowNode;
	toOffset: number;
	components: TName[];
}

export type ClosestResult<TName extends ComponentName> = ComponentByName<TName> | null;

export type ClosestFn = <TName extends ComponentName>(
	params: ClosestParams<TName>,
) => ClosestResult<TName>;

export interface ClosestBySelectionParams<TName extends ComponentName> {
	components: TName[];
}

export type ClosestBySelectionFn = <TName extends ComponentName>(
	params: ClosestBySelectionParams<TName>,
) => ClosestResult<TName>;

export interface ComponentLookup {
	closest: ClosestFn;
	closestBySelection: ClosestBySelectionFn;
}

export interface CreateComponentLookupParams {
	editorAPI: EditorAPI;
}

export interface CreateComponentLookupResult extends ComponentLookup {}
