import type {
	InlineComponentDraft,
	InlineComponentSnapshot,
} from "@rangex/core";
import type { JSONPattern } from "#utilities";
import type { ValidateComponentResult } from "../../../ValidateSnapshot-types";

export type InlineComponentState = Omit<
	InlineComponentSnapshot,
	"uniqueId" | "childNodes"
>;

export interface ValidateInlineComponentStateParams {
	inlineComponentDraft: InlineComponentDraft;
	expectedState: JSONPattern<InlineComponentState>;
}

export type ValidateInlineComponentStateResult = ValidateComponentResult;
