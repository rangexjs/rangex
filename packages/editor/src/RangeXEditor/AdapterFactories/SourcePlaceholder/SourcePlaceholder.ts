import {
  createSourcePlaceholderAdapter,
  type SourcePlaceholderSettings,
} from "#adapters/SourcePlaceholder";
import { configureSourcePlaceholder } from "#features";

import type { AdapterFactoryFn } from "../_Utilities";

export const SourcePlaceholder: AdapterFactoryFn<SourcePlaceholderSettings> = (settings) => {
  return (options, { editor }) => {
    const adapter = createSourcePlaceholderAdapter(settings, options);

    editor.sourcePlaceholder = adapter.publicPort;

    return {
      configure({ editorAPI }) {
        const cleanup = configureSourcePlaceholder({
          adapterBus: options.adapterBus,
          configPort: adapter.configPort,
          editorAPI,
        });

        return () => {
          cleanup();
        };
      },
    };
  };
};
