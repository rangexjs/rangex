import type {
	ComponentDraft,
	HTMLLayoutDraft,
	HTMLLayoutSnapshot,
} from "@rangex/core";
import type { JSONPattern } from "#utilities";
import type { ValidateComponentResult } from "../../ValidateSnapshot-types";

// Without domAttrs: they're resolved by the component's shape (see resolveDraftDOMAttrs)
export type HTMLLayoutState = Omit<
	HTMLLayoutSnapshot,
	"uniqueId" | "childNodes" | "domAttrs"
>;

export interface ValidateHTMLLayoutStateParams {
	componentDraft: ComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
	expectedState: JSONPattern<HTMLLayoutState>;
}

export type ValidateHTMLLayoutStateResult = ValidateComponentResult;
