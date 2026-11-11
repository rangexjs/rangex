import type { CreateListParams } from "@rangex/core";

import type { NestedEditableDefinition } from "../_Utilities";

export interface TodoListDefinition extends Pick<
	CreateListParams,
	"localName" | "lineType" | "editState"
> {
	itemNestedEditableProps: NestedEditableDefinition;
}
