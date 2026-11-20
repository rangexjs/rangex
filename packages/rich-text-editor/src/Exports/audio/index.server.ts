import type { Audio as AudioExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const Audio: typeof AudioExtension = createServerExtension;
