import { createContext } from "solid-js";
import type { MenuBarManagers, UIPortsContextValue } from "./App";

export const MenuBarManagersContext = createContext<MenuBarManagers>();

export const UIPortsContext = createContext<UIPortsContextValue>();
