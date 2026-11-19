import type { Mention as MentionExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const Mention: typeof MentionExtension = createServerExtension;
