import { useContext } from "solid-js";
import { CodeBlockContext } from "./CodeBlockContext";

export const useCodeBlockContext = () => {
	const value = useContext(CodeBlockContext);

	if (value === undefined) {
		throw new Error("Value can't be undefined.");
	}

	return value;
};
