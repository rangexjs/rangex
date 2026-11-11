import { componentsName } from "../../ComponentsName";
import type { TodoListDefinition } from "./TodoListDefinition-types";

/*
 * The state of every todo list and its items' NestedEditables: createTodoList builds them with this, and a snapshot's
 * todo list must match it. An item only allows inline components, each listed by name, so a new component stays out
 * until it's added.
 */
export const todoListDefinition = {
	localName: "ul",
	lineType: "multi-line",
	editState: "inherit",
	itemNestedEditableProps: {
		display: "block multi-line",
		editState: "inherit",
		allowedComponents: [
			componentsName.link,
			componentsName.mention,
			componentsName.templateVariable,
			componentsName.comment,
		],
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
	},
} satisfies TodoListDefinition;
