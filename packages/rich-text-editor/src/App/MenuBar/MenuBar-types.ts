import type { JSX } from "@solidjs/web";

import type { CreateViewMenuItemsParams } from "./View/ViewMenuItems-types";

export interface MenuBarProps extends CreateViewMenuItemsParams {
  class?: JSX.ClassValue;
}
