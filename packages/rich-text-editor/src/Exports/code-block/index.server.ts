import type { CodeBlock as CodeBlockExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const CodeBlock: typeof CodeBlockExtension = createServerExtension;
