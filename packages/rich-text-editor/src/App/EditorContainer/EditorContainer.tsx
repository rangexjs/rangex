import { EditorArea } from "../EditorArea";
import { EditorToolbar } from "../EditorToolbar";
import { MenuBar } from "../MenuBar";
import type { EditorContainerProps, ThemeValue } from "./EditorContainer-types";

const colorSchemeMap: Record<ThemeValue, string> = {
  light: "light",
  dark: "dark",
  system: "light dark",
};

export const EditorContainer = (props: EditorContainerProps) => {
  const colorScheme = () => colorSchemeMap[props.theme()];

  return (
    <div
      class="grid h-full grid-rows-[auto_auto_1fr] overflow-clip rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
      data-color-scheme={props.theme()}
      style={{ "color-scheme": colorScheme() }}
    >
      <MenuBar class="row-start-1" theme={props.theme} onThemeChange={props.onThemeChange} />
      <EditorToolbar
        class="row-start-2"
        toolbarButtonsLayout={props.toolbarButtonsLayout}
        toolbarButtons={props.toolbarButtons}
      />
      <EditorArea class="row-start-3">{props.editorContainer}</EditorArea>
    </div>
  );
};
