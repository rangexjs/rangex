import type { MenuBarProps } from "./MenuBar-types";
import { ViewMenu } from "./View";

export const MenuBar = (props: MenuBarProps) => (
  <div
    class={[
      "flex items-center gap-1 border-b border-neutral-200 bg-white px-2 py-1 dark:border-neutral-800 dark:bg-neutral-950",
      props.class,
    ]}
  >
    <ViewMenu theme={props.theme} onThemeChange={props.onThemeChange} />
  </div>
);
