import type { SourcePlaceholder as SourcePlaceholderExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const SourcePlaceholder: typeof SourcePlaceholderExtension = createServerExtension;
