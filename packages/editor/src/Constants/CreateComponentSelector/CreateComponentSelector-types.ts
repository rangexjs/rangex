import type { blockComponentAttrName, inlineComponentAttrName } from "@rangex/core";

import type { BlockComponentName, ComponentName, InlineComponentName } from "../ComponentsName";

export type ComponentAttrNameByName<TName extends ComponentName> = TName extends BlockComponentName
	? typeof blockComponentAttrName.dataName
	: TName extends InlineComponentName
		? typeof inlineComponentAttrName.dataName
		: never;
