import type { BlockNestedContext } from "rich-text-area";
import type { EmbedPort } from "#ports";
import type { EmbedInternals } from "../ConfigureEmbed-types";

export interface HandleEmbedSwapPopoverToggleParams {
	embedPort: EmbedPort;
	getCurrentBlock: () => BlockNestedContext | null;
	internals: EmbedInternals;
}
