import { createContext } from "solid-js";
import type {
	EditorOptions,
	MenuBarManagers,
	PopoverControllers,
	ToolbarButtonManagers,
} from "./App";

export const EditorOptionsContext = createContext<EditorOptions>();

export const MenuBarManagersContext = createContext<MenuBarManagers>();

export const PopoverControllersContext = createContext<PopoverControllers>();

export const ToolbarButtonManagersContext =
	createContext<ToolbarButtonManagers>();
