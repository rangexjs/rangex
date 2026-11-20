import type { LineHandler as LineHandlerExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const LineHandler: typeof LineHandlerExtension = createServerExtension;
