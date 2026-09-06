import type {
	CodeBlockAdapter,
	CodeBlockPublicPort,
} from "#adapters/CodeBlock";
import type {
	TemplateVariableAdapter,
	TemplateVariablePublicPort,
} from "#adapters/TemplateVariable";
import type {
	AccordionItemAdapter,
	AccordionItemPublicPort,
} from "../AccordionItemAdapter";
import type {
	EmptyMediaAdapter,
	EmptyMediaPublicPort,
} from "../EmptyMediaAdapter";
import type {
	FormattingAdapter,
	FormattingPublicPort,
} from "../FormattingAdapter";
import type { ImageAdapter, ImagePublicPort } from "../ImageAdapter";
import type { ReadOnlyAdapter, ReadOnlyPublicPort } from "../ReadOnlyAdapter";
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
	| ReadOnlyAdapter
	| TemplateVariableAdapter;

export interface AdapterPublicPorts {
	accordionItem: AccordionItemPublicPort;
	codeBlock: CodeBlockPublicPort;
	emptyMedia: EmptyMediaPublicPort;
	formatting: FormattingPublicPort;
	image: ImagePublicPort;
	readOnly: ReadOnlyPublicPort;
	templateVariable: TemplateVariablePublicPort;
}
