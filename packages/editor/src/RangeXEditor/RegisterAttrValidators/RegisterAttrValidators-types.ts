import type { AdapterBus } from "#adapters";
import type { SnapshotComponents } from "#snapshot";

export interface RegisterAttrValidatorsParams {
	adapterBus: AdapterBus;
	components: SnapshotComponents;
}
