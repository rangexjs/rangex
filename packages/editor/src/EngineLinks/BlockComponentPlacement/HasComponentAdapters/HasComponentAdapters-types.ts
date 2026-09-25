import type { AdapterBus } from "#adapters";
import type { BlockComponentName } from "../../Constants";

export interface HasComponentAdaptersParams {
	adapterBus: AdapterBus;
	allowedComponents: BlockComponentName[];
}

export type HasComponentAdaptersResult = boolean;
