import { AdapterBus } from "#adapters";

import type { ConfigureAdapterResult, RegisterAdapterResult } from "../AdapterFactories";
import { registerAttrValidators } from "./RegisterAttrValidators";
import type { RegisterAdaptersParams, RegisterAdaptersResult } from "./RegisterAdapters-types";
import { registerTableLimits } from "./RegisterTableLimits";

/*
 * Creates every given Adapter on a shared AdapterBus, then configures them. All of them are created before the first one
 * is configured, so each can rely on the others' ports. Returns the cleanup of every configured Adapter, run in order.
 */
export const registerAdapters = ({
  adapters,
  components,
  floatingContainer,
  editor,
  editorAPI,
}: RegisterAdaptersParams): RegisterAdaptersResult => {
  const adapterBus = new AdapterBus();

  registerAttrValidators({ adapterBus, components });

  registerTableLimits({ adapterBus, components });

  const registeredAdapters: RegisterAdapterResult[] = [];

  for (const adapter of adapters) {
    const registeredAdapter = adapter({ adapterBus, floatingContainer }, { editor });

    registeredAdapters.push(registeredAdapter);
  }

  const cleanupList = new Set<ConfigureAdapterResult>();

  for (const registeredAdapter of registeredAdapters) {
    const cleanup = registeredAdapter.configure({ editorAPI });

    cleanupList.add(cleanup);
  }

  return () => {
    for (const cleanup of cleanupList) {
      cleanup();
    }
  };
};
