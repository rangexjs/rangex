import type { UndoRedo as UndoRedoExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const UndoRedo: typeof UndoRedoExtension = createServerExtension;
