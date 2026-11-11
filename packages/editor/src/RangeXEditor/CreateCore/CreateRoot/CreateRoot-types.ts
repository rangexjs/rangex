import type { CreateRootEditableParams, RootEditable } from "@rangex/core";
import type { RootTypes } from "#constants";
import type { RootAttrs } from "#dom-attrs";

export interface CreateRichTextRootParams {
	type: RootTypes["richText"];
	attrs?: RootAttrs;
	childNodes?: CreateRootEditableParams["childNodes"];
}

export type CreateRootParams = CreateRichTextRootParams;

export type CreateRootResult = RootEditable;
