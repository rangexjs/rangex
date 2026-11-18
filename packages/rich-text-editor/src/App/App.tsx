import type { RangeXEditor } from "@rangex/editor";
import { type Accessor, type Component, For } from "solid-js";

import type { ToolbarButtonsLayout } from "#constants";
import type { UIOptions } from "#context";
import { EditorContext, UIOptionsContext } from "#context";
import type { ExtensionComponents } from "#extensions";

import { EditorContainer, type ThemeValue } from "./EditorContainer";

export interface AppProps {
  theme: Accessor<ThemeValue>;
  onThemeChange: (theme: ThemeValue) => void;
  components: ExtensionComponents;
  uiOptions: UIOptions;
  toolbarButtonsLayout: ToolbarButtonsLayout;
  editor: RangeXEditor;
  editorContainer: HTMLDivElement;
}

export const App: Component<AppProps> = (props) => {
  return (
    <EditorContext value={props.editor}>
      <UIOptionsContext value={props.uiOptions}>
        <EditorContainer
          theme={props.theme}
          onThemeChange={props.onThemeChange}
          toolbarButtonsLayout={props.toolbarButtonsLayout}
          toolbarButtons={props.components.toolbarButtons}
          editorContainer={props.editorContainer}
        />
        <For each={props.components.floatingComponents}>
          {(FloatingComponent) => <FloatingComponent />}
        </For>
      </UIOptionsContext>
    </EditorContext>
  );
};
