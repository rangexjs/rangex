import { createContext } from "solid-js";
import type {
	MenuBarManagers,
	PopoverControllers,
	ToolbarButtonManagers,
} from "./App";

export const MenuBarManagersContext = createContext<MenuBarManagers>();

export const PopoverControllersContext = createContext<PopoverControllers>();

export const ToolbarButtonManagersContext =
	createContext<ToolbarButtonManagers>();
