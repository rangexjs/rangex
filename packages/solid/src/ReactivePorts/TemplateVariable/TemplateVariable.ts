import type { TemplateVariablePublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveTemplateVariablePort } from "./TemplateVariable-types";

export const TemplateVariable = <
	T extends TemplateVariablePublicPort | undefined,
>(
	publicPort: T,
): PreserveUndefined<T, ReactiveTemplateVariablePort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveTemplateVariablePort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [options, setOptions] = createSignal(publicPort.options);
	const [query, setQuery] = createSignal(publicPort.caretMenu.query);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onOptionsUpdate(setOptions));
	onCleanup(publicPort.caretMenu.onQueryUpdate(setQuery));

	const port: ReactiveTemplateVariablePort = {
		canInsert,
		options,
		query,
		items: publicPort.items,
	};

	return port as PreserveUndefined<T, ReactiveTemplateVariablePort>;
};
