import { useContext } from "solid-js";
import { ReactiveEditorContext } from "./ReactiveEditorContext";

export const useReactiveEditorContext = () => {
	const value = useContext(ReactiveEditorContext);

	if (!value) {
		throw new Error("Value can't be undefined.");
	}

	return value;
};
