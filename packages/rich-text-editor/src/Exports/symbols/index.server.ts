import type { Symbols as SymbolsExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const Symbols: typeof SymbolsExtension = createServerExtension;
