import type {
	ComponentAttrs,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
} from "../_Utilities";
import type { todoListAttrsShape } from "./TodoListDOMAttrs";

export type TodoListAttrsShape = typeof todoListAttrsShape;

export type TodoListAttrs = ComponentAttrs<TodoListAttrsShape>;

export type TodoListAttrValidators = ComponentAttrValidators<TodoListAttrsShape>;

export type CreateTodoListAttrValidatorsParams =
	ComponentAttrValidatorOverrides<TodoListAttrsShape>;

export type CreateTodoListAttrValidatorsResult = TodoListAttrValidators;
