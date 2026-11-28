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

export interface ValidateSourceElementParams {
  componentDraft: BlockComponentDraft;
  htmlLayoutDraft: HTMLLayoutDraft;
  sourceElementLocalName: HTMLLayoutDraft["localName"];
  sourceElementAttrsShape: ElementAttrsShape;
  sourceElementAttrValidators: AnyElementAttrValidators;
}

export type ValidateSourceElementResult = ValidateComponentResult;

export interface ValidateFigcaptionParams {
  componentDraft: BlockComponentDraft;
  htmlLayoutDraft: HTMLLayoutDraft;
}

export type ValidateFigcaptionResult = ValidateComponentResult;

export interface ValidateFigureParams {
  componentDraft: BlockComponentDraft;
  htmlLayoutDraft: HTMLLayoutDraft;
  sourceElementLocalName: HTMLLayoutDraft["localName"];
  sourceElementAttrsShape: ElementAttrsShape;
  sourceElementAttrValidators: AnyElementAttrValidators;
}

export type ValidateFigureResult = ValidateComponentResult;

export interface ValidateSourceComponentParams {
  componentDraft: ComponentDraft;
  name: string;
  customStorage: JSONPattern<BlockComponentState["customStorage"]>;
  sourceElementLocalName: HTMLLayoutDraft["localName"];
  lineAttrsShape: ElementAttrsShape;
  lineAttrValidators: AnyElementAttrValidators;
  blockAttrsShape: ElementAttrsShape;
  blockAttrValidators: AnyElementAttrValidators;
  sourceElementAttrsShape: ElementAttrsShape;
  sourceElementAttrValidators: AnyElementAttrValidators;
}

export type ValidateSourceComponentResult = ValidateComponentResult;
