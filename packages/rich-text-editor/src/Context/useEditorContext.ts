import { useContext } from "solid-js";
import { EditorContext } from "./EditorContext";

export const useEditorContext = () => {
	const value = useContext(EditorContext);

	if (!value) {
		throw new Error("Value can't be undefined.");
	}

	return value;
};
