import type { RangeXEditor } from "@rangex/editor";
import { type Accessor, type Component, For } from "solid-js";

import type { ToolbarButtonsLayout } from "#constants";
import type { UIOptions } from "#context";
import { EditorContext, UIOptionsContext } from "#context";
import type { ExtensionComponents } from "#extensions";

import { EditorContainer, type ThemeValue } from "./EditorContainer";
import { EditorToolbar } from "./EditorToolbar";

export interface AppProps {
  theme: Accessor<ThemeValue>;
  onThemeChange: (theme: ThemeValue) => void;
  components: ExtensionComponents;
  uiOptions: UIOptions;
  toolbarButtonsLayout: ToolbarButtonsLayout;
  editor: RangeXEditor;
  host: HTMLElement;
  floatingContainer: HTMLDivElement;
}

export const App: Component<AppProps> = (props) => {
  return (
    <EditorContext value={props.editor}>
      <UIOptionsContext value={props.uiOptions}>
        <EditorContainer theme={props.theme} onThemeChange={props.onThemeChange}>
          <EditorToolbar
            toolbarButtonsLayout={props.toolbarButtonsLayout}
            toolbarButtons={props.components.toolbarButtons}
          />
          <div>{[props.host, props.floatingContainer]}</div>
          <For each={props.components.floatingComponents}>
            {(FloatingComponent) => <FloatingComponent />}
          </For>
        </EditorContainer>
      </UIOptionsContext>
    </EditorContext>
  );
};
