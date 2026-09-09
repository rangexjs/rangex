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
import type { AudioAdapter, AudioPublicPort } from "../AudioAdapter";
import type { EmbedAdapter, EmbedPublicPort } from "../EmbedAdapter";
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
import type {
	SeparatorAdapter,
	SeparatorPublicPort,
} from "../SeparatorAdapter";
import type { VideoAdapter, VideoPublicPort } from "../VideoAdapter";
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
	| AudioAdapter
	| CodeBlockAdapter
	| EmbedAdapter
	| EmptyMediaAdapter
	| FormattingAdapter
	| ImageAdapter
	| ReadOnlyAdapter
	| SeparatorAdapter
	| TemplateVariableAdapter
	| VideoAdapter;

export interface AdapterPublicPorts {
	accordionItem: AccordionItemPublicPort;
	audio: AudioPublicPort;
	codeBlock: CodeBlockPublicPort;
	embed: EmbedPublicPort;
	emptyMedia: EmptyMediaPublicPort;
	formatting: FormattingPublicPort;
	image: ImagePublicPort;
	readOnly: ReadOnlyPublicPort;
	separator: SeparatorPublicPort;
	templateVariable: TemplateVariablePublicPort;
	video: VideoPublicPort;
}
