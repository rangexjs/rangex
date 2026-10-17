import type {
	HTMLLayoutDraft,
	HTMLLayoutSnapshot,
	InlineComponentDraft,
	NestedEditableDraft,
	NestedEditableSnapshot,
} from "@rangex/core";
import type {
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export type AnchorState = Omit<HTMLLayoutSnapshot, "uniqueId" | "childNodes">;

export type NestedEditableState = Omit<
	NestedEditableSnapshot,
	"uniqueId" | "childNodes"
>;

export interface ValidateAnchorParams {
	linkDraft: InlineComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
}

export type ValidateAnchorResult = ValidateComponentResult;

export interface ValidateNestedEditableParams {
	linkDraft: InlineComponentDraft;
	nestedEditableDraft: NestedEditableDraft;
}

export type ValidateNestedEditableResult = ValidateComponentResult;

export interface ValidateLinkParams extends ValidateComponentParams {}

export type ValidateLinkResult = ValidateComponentResult;
