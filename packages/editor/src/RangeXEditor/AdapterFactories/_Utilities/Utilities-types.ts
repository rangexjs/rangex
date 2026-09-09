import type { AccordionItem } from "../AccordionItem";
import type { Audio } from "../Audio";
import type { CodeBlock } from "../CodeBlock";
import type { Embed } from "../Embed";
import type { Emoji } from "../Emoji";
import type { EmptyMedia } from "../EmptyMedia";
import type { Formatting } from "../Formatting";
import type { Image } from "../Image";
import type { Mention } from "../Mention";
import type { ReadOnly } from "../ReadOnly";
import type { Separator } from "../Separator";
import type { TemplateVariable } from "../TemplateVariable";
import type { Video } from "../Video";

export type AdapterFactory =
	| typeof AccordionItem
	| typeof Audio
	| typeof CodeBlock
	| typeof Embed
	| typeof Emoji
	| typeof EmptyMedia
	| typeof Formatting
	| typeof Image
	| typeof Mention
	| typeof ReadOnly
	| typeof Separator
	| typeof TemplateVariable
	| typeof Video;

export type AdapterFactoryValue = ReturnType<AdapterFactory>;
