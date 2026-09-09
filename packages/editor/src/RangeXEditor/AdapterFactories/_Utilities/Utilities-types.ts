import type { AccordionItem } from "../AccordionItem";
import type { Audio } from "../Audio";
import type { CodeBlock } from "../CodeBlock";
import type { Embed } from "../Embed";
import type { EmptyMedia } from "../EmptyMedia";
import type { Formatting } from "../Formatting";
import type { Image } from "../Image";
import type { Separator } from "../Separator";
import type { Video } from "../Video";

export type AdapterFactory =
	| typeof AccordionItem
	| typeof Audio
	| typeof CodeBlock
	| typeof Embed
	| typeof EmptyMedia
	| typeof Formatting
	| typeof Image
	| typeof Separator
	| typeof Video;

export type AdapterFactoryValue = ReturnType<AdapterFactory>;
