import type {
	blockComponentAttrName,
	inlineComponentAttrName,
} from "rich-text-area";
import type {
	BlockComponentName,
	ComponentName,
	InlineComponentName,
} from "../ComponentsName";

export type ComponentAttrNameByName<TName extends ComponentName> =
	TName extends BlockComponentName
		? typeof blockComponentAttrName.dataComponentName
		: TName extends InlineComponentName
			? typeof inlineComponentAttrName.dataComponentName
			: never;
