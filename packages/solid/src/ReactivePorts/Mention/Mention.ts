import type { MentionPublicPort } from "@rangex/editor/mention";
import type { PreserveUndefined } from "../../_Utilities";
import { CaretMenu } from "../_Utilities";
import type { ReactiveMentionPort } from "./Mention-types";

export const Mention = <T extends MentionPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveMentionPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveMentionPort>;
	}

	const port: ReactiveMentionPort = {
		caretMenu: CaretMenu(publicPort.caretMenu),
	};

	return port as PreserveUndefined<T, ReactiveMentionPort>;
};
