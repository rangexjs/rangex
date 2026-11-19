import type { FindReplace as FindReplaceExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const FindReplace: typeof FindReplaceExtension = createServerExtension;
