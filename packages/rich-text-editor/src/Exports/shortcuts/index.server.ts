import type { Shortcuts as ShortcutsExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const Shortcuts: typeof ShortcutsExtension = createServerExtension;
