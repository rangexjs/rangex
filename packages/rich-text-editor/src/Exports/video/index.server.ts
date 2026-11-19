import type { Video as VideoExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const Video: typeof VideoExtension = createServerExtension;
