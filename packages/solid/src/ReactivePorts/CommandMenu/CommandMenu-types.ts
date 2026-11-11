import type { CommandMenuAvailableItems } from "@rangex/editor/command-menu";
import type { Accessor } from "solid-js";

import type { ReactiveCaretMenuPort } from "../_Utilities";

export interface ReactiveCommandMenuPort {
	caretMenu: ReactiveCaretMenuPort;
	availableItems: Accessor<CommandMenuAvailableItems>;
}
