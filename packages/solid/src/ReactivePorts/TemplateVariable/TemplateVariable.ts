import type { TemplateVariablePublicPort } from "@rangex/editor/template-variable";
import { createSignal, onCleanup } from "solid-js";

import type { PreserveUndefined } from "../../_Utilities";
import { CaretMenu } from "../_Utilities";
import type { ReactiveTemplateVariablePort } from "./TemplateVariable-types";

export const TemplateVariable = <T extends TemplateVariablePublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveTemplateVariablePort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveTemplateVariablePort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [fields, setFields] = createSignal(publicPort.fields);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onFieldsUpdate(setFields));

	const port: ReactiveTemplateVariablePort = {
		caretMenu: CaretMenu(publicPort.caretMenu),
		canInsert,
		fields,
	};

	return port as PreserveUndefined<T, ReactiveTemplateVariablePort>;
};
