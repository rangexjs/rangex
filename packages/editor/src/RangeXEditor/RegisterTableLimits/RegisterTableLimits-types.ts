import type { AdapterBus } from "#adapters";
import type { SnapshotComponents } from "#snapshot";

export interface RegisterTableLimitsParams {
	adapterBus: AdapterBus;
	components: SnapshotComponents;
}
