import type { CommandMenuPublicPort } from "@rangex/editor";
import type { PreserveUndefined } from "../../_Utilities";
import { CaretMenu } from "../_Utilities";
import type { ReactiveCommandMenuPort } from "./CommandMenu-types";

export const CommandMenu = <T extends CommandMenuPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveCommandMenuPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveCommandMenuPort>;
	}

	const port: ReactiveCommandMenuPort = {
		caretMenu: CaretMenu(publicPort.caretMenu),
	};

	return port as PreserveUndefined<T, ReactiveCommandMenuPort>;
};
