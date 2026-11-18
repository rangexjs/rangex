import { createEditor } from "@rangex/editor";
import { render } from "@solidjs/web";
import { createSignal, flush } from "solid-js";

import type { UIOptions } from "#context";
import type { ExtensionComponents } from "#extensions";

import { App } from "../App";
import type { ThemeValue } from "../App/EditorContainer";
import { getEditorStyles } from "../EngineStyles";
import { defaultToolbarButtonsLayout, registerTailwindProperties } from "./_Utilities";
import type {
  CreateRichTextEditorParams,
  CreateRichTextEditorResult,
  RichTextEditor,
} from "./CreateRichTextEditor-types";

import globalStyles from "../ComponentStyles/global.css?inline";

export const createRichTextEditor = ({
  licenseKey,
  storedSnapshot,
  snapshotSchema,
  extensions,
  toolbarButtonsLayout = defaultToolbarButtonsLayout,
  theme: initialTheme = "system",
}: CreateRichTextEditorParams): CreateRichTextEditorResult => {
  const [theme, setTheme] = createSignal<ThemeValue>(initialTheme);

  const adapters = extensions.map(({ createAdapter }) => createAdapter());

  const styles = getEditorStyles();

  const { editor, host, floatingContainer, hostStyles } = createEditor({
    licenseKey,
    storedSnapshot,
    snapshotSchema,
    adapters,
    styles,
  });

  const editorStyle = new CSSStyleSheet();
  editorStyle.replaceSync(globalStyles + hostStyles);

  const unregisterTailwindProperties = registerTailwindProperties({ styleSheet: editorStyle });

  const components = extensions.reduce<ExtensionComponents>(
    (prev, value) => {
      Object.assign(prev.toolbarButtons, value.components.toolbarButtons);
      prev.floatingComponents.push(...value.components.floatingComponents);

      return prev;
    },
    { toolbarButtons: {}, floatingComponents: [] },
  );

  const uiOptions = extensions.reduce<UIOptions>(
    (prev, value) => Object.assign(prev, value.uiOptions),
    {},
  );

  for (const { register } of extensions) {
    register?.(editor);
  }

  const editorHost = document.createElement("div");
  editorHost.classList.add(..."flex min-h-0 flex-col".split(" "));

  const dispose = render(
    () => (
      <App
        theme={theme}
        onThemeChange={setTheme}
        components={components}
        uiOptions={uiOptions}
        toolbarButtonsLayout={toolbarButtonsLayout}
        editor={editor}
        host={host}
        floatingContainer={floatingContainer}
      />
    ),
    editorHost,
  );

  const richTextEditor: RichTextEditor = {
    get editorHost() {
      return editorHost;
    },

    get editorStyle() {
      return editorStyle;
    },

    get theme() {
      return theme();
    },

    set theme(value) {
      setTheme(value);
      flush();
    },

    createStoredSnapshot() {
      return editor.snapshot.createStored();
    },

    destroy() {
      editor.destroy();
      dispose();
      unregisterTailwindProperties();
    },
  };

  return richTextEditor;
};
