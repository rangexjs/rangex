import type { AccordionItemAdapter } from "../AccordionItemAdapter";
import type { EmptyMediaAdapter } from "../EmptyMediaAdapter";
import type { FormattingAdapter } from "../FormattingAdapter";
import type { ImageAdapter } from "../ImageAdapter";
import type { AdapterBus } from "./AdapterBus";

export interface AdapterOptions {
	adapterBus: AdapterBus;
	floatingContainer: HTMLDivElement;
}

export type CreateAdapterConstructor<Settings extends object> = [
	Settings,
	AdapterOptions,
];

export type Adapter =
	| AccordionItemAdapter
	| EmptyMediaAdapter
	| FormattingAdapter
	| ImageAdapter;
