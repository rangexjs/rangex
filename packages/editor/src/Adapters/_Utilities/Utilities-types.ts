import type { CodeBlockAdapter } from "#adapters/CodeBlock";
import type { TemplateVariableAdapter } from "#adapters/TemplateVariable";
import type { AccordionItemAdapter } from "../AccordionItemAdapter";
import type { EmptyMediaAdapter } from "../EmptyMediaAdapter";
import type { FormattingAdapter } from "../FormattingAdapter";
import type { ImageAdapter } from "../ImageAdapter";
import type { AdapterBus } from "./AdapterBus";

export interface AdapterOptions {
	adapterBus: AdapterBus;
	floatingContainer: HTMLDivElement;
}

export type CreateAdapterParams<Settings extends object> = [
	Settings,
	AdapterOptions,
];

export type Adapter =
	| AccordionItemAdapter
	| CodeBlockAdapter
	| EmptyMediaAdapter
	| FormattingAdapter
	| ImageAdapter
	| TemplateVariableAdapter;
