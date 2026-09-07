import type { AccordionItem } from "../AccordionItem";
import type { CodeBlock } from "../CodeBlock";
import type { EmptyMedia } from "../EmptyMedia";
import type { Formatting } from "../Formatting";
import type { Image } from "../Image";
import type { Separator } from "../Separator";

export type AdapterFactory =
	| typeof AccordionItem
	| typeof CodeBlock
	| typeof EmptyMedia
	| typeof Formatting
	| typeof Image
	| typeof Separator;

export type AdapterFactoryValue = ReturnType<AdapterFactory>;
