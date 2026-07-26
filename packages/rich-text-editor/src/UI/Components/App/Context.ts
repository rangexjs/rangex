import { createContext } from "solid-js";
import type {
	MenuBarManagers,
	ToolbarButtonManagers,
	UIPortsContextValue,
} from "./App";

export const MenuBarManagersContext = createContext<MenuBarManagers>();

export const ToolbarButtonManagersContext =
	createContext<ToolbarButtonManagers>();

export const UIPortsContext = createContext<UIPortsContextValue>();
