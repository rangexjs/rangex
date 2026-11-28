import { extendObjectProperties } from "#utilities";

import { createEmitter, createStateEmitter } from "../_Utilities";
import type {
  CreateReadOnlyAdapterParams,
  CreateReadOnlyAdapterResult,
  OnToggleCallbackFn,
  ReadOnlyConfigPort,
  ReadOnlyConfigPortProps,
  ReadOnlyPublicPort,
  ReadOnlyPublicPortProps,
  UpdateStateParams,
} from "./ReadOnlyAdapter-types";

export const createReadOnlyAdapter = (
  ...params: CreateReadOnlyAdapterParams
): CreateReadOnlyAdapterResult => {
  const [{ initialEnabled = false }, { adapterBus }] = params;

  adapterBus.registerAdapter("readOnly");

  // States
  const isEnabledState = createStateEmitter<boolean>(false);

  // CommandListeners
  const toggleEmitter = createEmitter<OnToggleCallbackFn>();

  const updateState = ({ isEnabled }: UpdateStateParams) => {
    if (isEnabled !== undefined) {
      isEnabledState.set(isEnabled);
    }
  };

  const configPort: ReadOnlyConfigPort = extendObjectProperties({}, {
    get initialEnabled() {
      return initialEnabled;
    },

    updateState(params) {
      updateState(params);
    },

    onToggle(callback) {
      return toggleEmitter.subscribe(callback);
    },
  } satisfies ReadOnlyConfigPortProps);

  const publicPort: ReadOnlyPublicPort = extendObjectProperties({}, {
    get isEnabled() {
      return isEnabledState.get();
    },

    onIsEnabledUpdate(callback) {
      return isEnabledState.subscribe(callback);
    },

    toggle({ force }) {
      toggleEmitter.emit({ isEnabled: isEnabledState.get(), force });
    },
  } satisfies ReadOnlyPublicPortProps);

  return { configPort, publicPort };
};
