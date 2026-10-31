import type { RootEditableDraft, RootEditableSnapshot } from "@rangex/core";
import type { RootType } from "#constants";
import type { CreateRootAttrValidatorsParams } from "#dom-attrs";
import type { RootStorage } from "#storage";
import type { ValidateStorageFn } from "../_Utilities";
import type { ValidateComponentResult } from "../ValidateSnapshot-types";

// Without domAttrs: they're resolved by the Root's shape (see resolveDraftDOMAttrs)
export type RootState = Omit<
	RootEditableSnapshot,
	"uniqueId" | "childNodes" | "domAttrs"
>;

/*
 * The root a snapshot must have: its type, and the same attrValidators as the editor's
 */
export interface SnapshotRoot {
	type: RootType;
	attrValidators?: CreateRootAttrValidatorsParams;
	validateStorage?: ValidateStorageFn<RootStorage>;
}

export interface ValidateRootParams extends SnapshotRoot {
	rootEditableDraft: RootEditableDraft;
}

export type ValidateRootResult = ValidateComponentResult;
