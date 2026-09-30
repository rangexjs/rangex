import { blockComponentAttrName, inlineComponentAttrName } from "@rangex/core";
import { assertNever } from "#utilities";
import {
	type ComponentName,
	isBlockComponentName,
	isInlineComponentName,
} from "../ComponentsName";
import type { ComponentAttrNameByName } from "./CreateComponentSelector-types";

/*
 * Builds a typed attribute selector matching components of the given name, using the inline or block
 * component attribute depending on the name.
 */
export const createComponentSelector = <Name extends ComponentName>(
	name: Name,
) => {
	if (isInlineComponentName(name)) {
		const { dataName } = inlineComponentAttrName;
		const typedName = dataName as ComponentAttrNameByName<Name>;
		return `[${typedName}="${name}"]` as const;
	}

	if (isBlockComponentName(name)) {
		const { dataName } = blockComponentAttrName;
		const typedName = dataName as ComponentAttrNameByName<Name>;
		return `[${typedName}="${name}"]` as const;
	}

	return assertNever(name);
};
