import type { AdapterName } from "#adapters";
import { type BlockComponentName, blockComponentsName } from "#constants";
import type {
	HasComponentAdaptersParams,
	HasComponentAdaptersResult,
} from "./HasComponentAdapters-types";

const componentAdapterNames: Record<BlockComponentName, AdapterName> = {
	[blockComponentsName.accordionItem]: "accordionItem",
	[blockComponentsName.audio]: "audio",
	[blockComponentsName.blockQuote]: "blockQuote",
	[blockComponentsName.codeBlock]: "codeBlock",
	[blockComponentsName.embed]: "embed",
	[blockComponentsName.emptyMedia]: "emptyMedia",
	[blockComponentsName.image]: "image",
	[blockComponentsName.list]: "list",
	[blockComponentsName.separator]: "separator",
	[blockComponentsName.table]: "table",
	[blockComponentsName.todoList]: "todoList",
	[blockComponentsName.video]: "video",
};

/*
 * Whether every given block component's Adapter was registered on the AdapterBus. A component
 * whose Adapter is missing can't be offered, however the engine would place it.
 */
export const hasComponentAdapters = ({
	adapterBus,
	allowedComponents,
}: HasComponentAdaptersParams): HasComponentAdaptersResult => {
	return allowedComponents.every((componentName) => {
		const adapterName = componentAdapterNames[componentName];

		return adapterBus.hasAdapter(adapterName);
	});
};
