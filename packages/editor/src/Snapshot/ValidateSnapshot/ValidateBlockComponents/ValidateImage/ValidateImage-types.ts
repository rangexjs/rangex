import type { BlockComponentDraft, HTMLLayoutDraft } from "@rangex/core";
import type {
	CreateImageAttrValidatorsParams,
	ImageAttrValidators,
} from "#dom-attrs";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface FindHTMLLayoutDraftParams {
	childNodes: HTMLLayoutDraft["childNodes"];
	localName: string;
}

export type FindHTMLLayoutDraftResult = HTMLLayoutDraft | undefined;

export interface ValidateImgParams {
	componentDraft: BlockComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
	imgAttrValidators: ImageAttrValidators["img"];
}

export type ValidateImgResult = ValidateComponentResult;

export interface ValidateFigcaptionParams {
	componentDraft: BlockComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
}

export type ValidateFigcaptionResult = ValidateComponentResult;

export interface ValidateFigureParams {
	componentDraft: BlockComponentDraft;
	htmlLayoutDraft: HTMLLayoutDraft;
	imgAttrValidators: ImageAttrValidators["img"];
}

export type ValidateFigureResult = ValidateComponentResult;

export interface ValidateImageParams extends ValidateComponentParams {
	attrValidators: ImageAttrValidators;
}

export type ValidateImageResult = ValidateComponentResult;

export interface CreateImageValidatorParams {
	attrValidators?: CreateImageAttrValidatorsParams;
}

export type CreateImageValidatorResult = ComponentValidator;
