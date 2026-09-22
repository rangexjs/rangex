import type { Accessor } from "solid-js";
import type { ThemeValue } from "../../EditorContainer";

export interface CreateViewMenuItemsParams {
	theme: Accessor<ThemeValue>;
	onThemeChange: (theme: ThemeValue) => void;
}
