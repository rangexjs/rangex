import { createContext } from "solid-js";
import type {
	EditorOptions,
	MenuBarManagers,
	ToolbarButtonManagers,
} from "./App";

export const EditorOptionsContext = createContext<EditorOptions>();

export const MenuBarManagersContext = createContext<MenuBarManagers>();

export const ToolbarButtonManagersContext =
	createContext<ToolbarButtonManagers>();
