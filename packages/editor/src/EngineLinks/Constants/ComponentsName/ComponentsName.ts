export const inlineComponentsName = {
	link: "link",
	mention: "mention",
	templateVariable: "template-variable",
} as const;

export const blockComponentsName = {
	accordionItem: "accordion-item",
	audio: "audio",
	blockQuote: "block-quote",
	codeBlock: "code-block",
	embed: "embed",
	emptyMedia: "empty-media",
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
