import type { Emoji as EmojiExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const Emoji: typeof EmojiExtension = createServerExtension;
