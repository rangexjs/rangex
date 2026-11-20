import type { Markdown as MarkdownExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const Markdown: typeof MarkdownExtension = createServerExtension;
