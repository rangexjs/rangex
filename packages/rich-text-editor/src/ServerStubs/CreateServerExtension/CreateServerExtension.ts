import type { Extension } from "#extensions";

import { createClientOnlyFn } from "../CreateClientOnlyFn";

/**
 * The server stand-in for every extension factory. It accepts any settings and returns an extension
 * without components, so extension lists can be built in code that also runs on the server.
 */
export const createServerExtension = (): Extension => {
  return {
    createAdapter: createClientOnlyFn("createAdapter"),
    components: {
      toolbarButtons: {},
      floatingComponents: [],
    },
  };
};
