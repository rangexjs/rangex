import type { BlockComponentDraft, ComponentDraft, HTMLLayoutDraft } from "@rangex/core";

import type { AnyElementAttrValidators, ElementAttrsShape } from "#dom-attrs";
import type { JSONPattern } from "#utilities";

import type { ValidateComponentResult } from "../../../ValidateSnapshot-types";
import type { BlockComponentState } from "../ValidateBlockComponentState";

export interface FindHTMLLayoutDraftParams {
	childNodes: HTMLLayoutDraft["childNodes"];
	localName: string;
}

export type FindHTMLLayoutDraftResult = HTMLLayoutDraft | undefined;

export interface ValidateMediaParams {
	componentDraft: BlockComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
	mediaLocalName: HTMLLayoutDraft["localName"];
	mediaAttrsShape: ElementAttrsShape;
	mediaAttrValidators: AnyElementAttrValidators;
}

export type ValidateMediaResult = ValidateComponentResult;

export interface ValidateFigcaptionParams {
	componentDraft: BlockComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
}

export type ValidateFigcaptionResult = ValidateComponentResult;

export interface ValidateFigureParams {
	componentDraft: BlockComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
	mediaLocalName: HTMLLayoutDraft["localName"];
	mediaAttrsShape: ElementAttrsShape;
	mediaAttrValidators: AnyElementAttrValidators;
}

export type ValidateFigureResult = ValidateComponentResult;

export interface ValidateMediaComponentParams {
	componentDraft: ComponentDraft;
	name: string;
	customStorage: JSONPattern<BlockComponentState["customStorage"]>;
	mediaLocalName: HTMLLayoutDraft["localName"];
	lineAttrsShape: ElementAttrsShape;
	lineAttrValidators: AnyElementAttrValidators;
	blockAttrsShape: ElementAttrsShape;
	blockAttrValidators: AnyElementAttrValidators;
	mediaAttrsShape: ElementAttrsShape;
	mediaAttrValidators: AnyElementAttrValidators;
}

export type ValidateMediaComponentResult = ValidateComponentResult;
