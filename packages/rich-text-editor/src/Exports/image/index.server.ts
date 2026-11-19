import type { Image as ImageExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const Image: typeof ImageExtension = createServerExtension;
