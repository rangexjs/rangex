import type { Embed as EmbedExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const Embed: typeof EmbedExtension = createServerExtension;
