export const componentsName = {
	blockQuote: "block-quote",
	codeBlock: "code-block",
	collapsible: "collapsible",
	image: "image",
	link: "link",
	list: "list",
	mention: "mention",
	table: "table",
	templateVariable: "template-variable",
	todoList: "todo-list",
	video: "video",
} as const;

export const dataPartName = `data-part-name`;

export const createPart = <Name extends string>(name: Name) => {
	const part = {
		name,
		attr: `[${dataPartName}="${name}"]`,
	} as const;

	return part;
};

export const imagePart = {
	dropzone: createPart("dropzone"),
} as const;
