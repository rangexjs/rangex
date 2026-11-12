import { useContext } from "solid-js";

import { UIOptionsContext } from "./UIOptionsContext";

export const useUIOptionsContext = () => {
	const value = useContext(UIOptionsContext);

	if (value === undefined) {
		throw new Error("Value can't be undefined.");
	}

	return value;
};
