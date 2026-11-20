import { createEditor } from "@rangex/editor";
import { render } from "@solidjs/web";
import { createSignal, flush, onHydrationEnd, runWithOwner } from "solid-js";

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

  const { editor, editorContainer, containerStyles } = createEditor({
    licenseKey,
    storedSnapshot,
    snapshotSchema,
    adapters,
    styles,
  });

  const editorStyle = new CSSStyleSheet();
  editorStyle.replaceSync(globalStyles + containerStyles);

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

  const editorHost = document.createElement("div");
  editorHost.classList.add("h-full");

  let dispose: (() => void) | undefined;
  let destroyed = false;

  const mount = () => {
    if (destroyed) {
      return;
    }

    // Extensions may render Solid UI from `register` too (e.g. source placeholder slots), so it shares the deferral.
    for (const { register } of extensions) {
      register?.(editor);
    }

    dispose = render(
      () => (
        <App
          theme={theme}
          onThemeChange={setTheme}
          components={components}
          uiOptions={uiOptions}
          toolbarButtonsLayout={toolbarButtonsLayout}
          editor={editor}
          editorContainer={editorContainer}
        />
      ),
      editorHost,
    );
  };

  // The UI mounts asynchronously, never inside the caller's synchronous scope. A Solid host typically calls this from
  // `onSettled`, where mounting inline breaks:
  // - during hydration, `render()` sees Solid's global hydration flag, takes hydration code paths, finds no server
  //   markup to claim and renders nothing;
  // - after hydration (e.g. client-side navigation), `render()` calls `flush()`, which isn't reentrant inside
  //   `onSettled` and throws.
  // `onHydrationEnd` covers both: it waits for hydration to end, or runs in the next microtask when none is going on.
  onHydrationEnd(() => runWithOwner(null, mount));

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
      destroyed = true;
      editor.destroy();
      dispose?.();
      unregisterTailwindProperties();
    },
  };

  return richTextEditor;
};
