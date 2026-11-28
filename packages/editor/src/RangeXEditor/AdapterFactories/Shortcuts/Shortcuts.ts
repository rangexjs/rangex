import { createShortcutsAdapter, type ShortcutsSettings } from "#adapters/Shortcuts";
import { configureShortcuts } from "#features";

import type { AdapterFactoryFn } from "../_Utilities";

export const Shortcuts: AdapterFactoryFn<ShortcutsSettings> = (settings) => {
  return (options, { editor }) => {
    const adapter = createShortcutsAdapter(settings, options);

    editor.shortcuts = adapter.publicPort;

    return {
      configure({ editorAPI }) {
        const cleanup = configureShortcuts({ editorAPI });

        return () => {
          cleanup();
        };
      },
    };
  };
};
