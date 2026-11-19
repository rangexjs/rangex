import type { TemplateVariable as TemplateVariableExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const TemplateVariable: typeof TemplateVariableExtension = createServerExtension;
