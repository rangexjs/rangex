import type { CaretMenuQuery } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveMentionPort {
	query: Accessor<CaretMenuQuery>;
}
