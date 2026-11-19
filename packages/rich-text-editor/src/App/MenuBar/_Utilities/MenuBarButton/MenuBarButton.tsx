import type { MenuBarButtonProps } from "./MenuBarButton-types";

export const MenuBarButton = (props: MenuBarButtonProps) => (
  <button
    type="button"
    class="btn-menu-trigger rounded-sm px-2 py-0.5 text-xs font-medium"
    commandfor={props.commandfor}
    command={props.command}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);
