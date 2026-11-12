import type { RootEditableDraft, RootEditableSnapshot } from "@rangex/core";

import type { RootType } from "#constants";
import type { CreateRootAttrValidatorsParams } from "#dom-attrs";
import type { RootStorage } from "#storage";

import type { ValidateStorageFn } from "../_Utilities";
import type { ValidateComponentResult } from "../ValidateSnapshot-types";

// Without domAttrs: they're resolved by the Root's shape (see resolveDraftDOMAttrs)
export type RootState = Omit<RootEditableSnapshot, "uniqueId" | "childNodes" | "domAttrs">;

// The first one is the type of a new root, when the editor loads no snapshot
export type SnapshotRootTypes = [RootType, ...RootType[]];

/*
 * The root a snapshot must have: it's valid if its type is one of the given ones
 */
export interface SnapshotRoot {
	types: SnapshotRootTypes;
	attrValidators?: CreateRootAttrValidatorsParams;
	validateStorage?: ValidateStorageFn<RootStorage>;
}

export interface ResolveRootTypeParams {
	customStorage: RootEditableDraft["customStorage"];
	types: SnapshotRootTypes;
}

export type ResolveRootTypeResult = RootType;

export interface ValidateRootParams extends SnapshotRoot {
	rootEditableDraft: RootEditableDraft;
}

export type ValidateRootResult = ValidateComponentResult;
