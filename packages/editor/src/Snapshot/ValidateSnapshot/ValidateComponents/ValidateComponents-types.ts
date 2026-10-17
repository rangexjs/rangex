import type { RootEditableDraft } from "@rangex/core";
import type {
	ComponentValidator,
	ValidateComponentResult,
} from "../ValidateSnapshot-types";

export interface ValidateComponentsParams {
	rootEditableDraft: RootEditableDraft;
	componentValidators: ComponentValidator[];
}

export type ValidateComponentsResult = ValidateComponentResult;
