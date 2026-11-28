import type { Accessor } from "solid-js";

export interface ReactiveReadOnlyPort {
  isEnabled: Accessor<boolean>;
}
