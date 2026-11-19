import type { TodoList as TodoListExtension } from "#extensions";

import { createServerExtension } from "../../ServerStubs";

export const TodoList: typeof TodoListExtension = createServerExtension;
