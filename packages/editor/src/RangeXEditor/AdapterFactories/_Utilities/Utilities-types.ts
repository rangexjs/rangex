import type { AccordionItem } from "../AccordionItem";
import type { EmptyMedia } from "../EmptyMedia";
import type { Formatting } from "../Formatting";
import type { Image } from "../Image";

export type AdapterValue =
	| ReturnType<typeof AccordionItem>
	| ReturnType<typeof EmptyMedia>
	| ReturnType<typeof Formatting>
	| ReturnType<typeof Image>;
