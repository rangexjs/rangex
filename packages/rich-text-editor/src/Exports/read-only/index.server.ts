import type { ReadOnly as ReadOnlyExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const ReadOnly: typeof ReadOnlyExtension = createServerExtension;
