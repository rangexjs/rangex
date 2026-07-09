import type { componentsName } from "../ComponentsName";

export type ComponentsName = typeof componentsName;

export type ComponentName = ComponentsName[keyof ComponentsName];
