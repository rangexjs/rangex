import type { CreateListParams } from "@rangex/core";

import type { NestedEditableDefinition } from "../_Utilities";

export interface ListDefinition extends Pick<CreateListParams, "lineType" | "editState"> {
	itemNestedEditableProps: NestedEditableDefinition;
}
