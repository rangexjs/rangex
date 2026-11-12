import type {
	BlockComponentName,
	ComponentName,
	InlineComponentName,
} from "./ComponentsName-types";

export const inlineComponentsName = {
	link: "link",
	mention: "mention",
	templateVariable: "template-variable",
	comment: "comment",
} as const;

export const blockComponentsName = {
	accordionItem: "accordion-item",
	audio: "audio",
	blockQuote: "block-quote",
	codeBlock: "code-block",
	embed: "embed",
	sourcePlaceholder: "source-placeholder",
	image: "image",
	list: "list",
	separator: "separator",
	table: "table",
	todoList: "todo-list",
	video: "video",
} as const;

export const componentsName = {
	...inlineComponentsName,
	...blockComponentsName,
} as const;

const inlineComponentNames: ComponentName[] = Object.values(inlineComponentsName);

const blockComponentNames: ComponentName[] = Object.values(blockComponentsName);

export const isInlineComponentName = (name: ComponentName): name is InlineComponentName =>
	inlineComponentNames.includes(name);

export const isBlockComponentName = (name: ComponentName): name is BlockComponentName =>
	blockComponentNames.includes(name);

export const dataPartName = `data-part-name`;

export const createPart = <Name extends string>(name: Name) => {
	const part = {
		name,
		attr: `[${dataPartName}="${name}"]`,
	} as const;

	return part;
};

export const todoCheckboxName = "todo-checkbox";

export const todoCheckboxPart = createPart("todo-checkbox");
