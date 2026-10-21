import type { HTMLLayout, InlineComponent } from "@rangex/core";

export interface GetLinkPartsParams {
	link: InlineComponent;
}

export interface GetLinkPartsResult {
	anchor: HTMLLayout;
}
