import type { CommandMenu as CommandMenuExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const CommandMenu: typeof CommandMenuExtension = createServerExtension;
