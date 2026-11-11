import type { BlockComponentDraft, BlockComponentSnapshot } from "@rangex/core";
import type { JSONPattern } from "#utilities";
import type { ValidateComponentResult } from "../../../ValidateSnapshot-types";

// Without domAttrs: they're resolved by the component's shape (see resolveDraftDOMAttrs)
export type BlockComponentState = Omit<
	BlockComponentSnapshot,
	"uniqueId" | "childNodes" | "domAttrs"
>;

export interface ValidateBlockComponentStateParams {
	blockComponentDraft: BlockComponentDraft;
	expectedState: JSONPattern<BlockComponentState>;
}

export type ValidateBlockComponentStateResult = ValidateComponentResult;
