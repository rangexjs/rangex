import type {
	blockComponentsName,
	componentsName,
	inlineComponentsName,
} from "../ComponentsName";

export type InlineComponentsName = typeof inlineComponentsName;

export type InlineComponentName =
	InlineComponentsName[keyof InlineComponentsName];

export type BlockComponentsName = typeof blockComponentsName;

export type BlockComponentName = BlockComponentsName[keyof BlockComponentsName];

export type ComponentsName = typeof componentsName;

export type ComponentName = ComponentsName[keyof ComponentsName];
