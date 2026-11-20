import type { Table as TableExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const Table: typeof TableExtension = createServerExtension;
