/**
 * One `Symbol` per Adapter that needs to be picked out of a plain `unknown[]` (e.g.
 * `BuildUIPorts`) without importing the Adapter's own class — an `instanceof` check forces a
 * bundler to keep that class even for extensions the consumer never opted into, defeating
 * tree-shaking. Every Adapter exposes its id as a plain `readonly id` field.
 */
export const adapterIds = {
	accordionItem: Symbol("accordionItem"),
	audio: Symbol("audio"),
	blockQuote: Symbol("blockQuote"),
	codeBlock: Symbol("codeBlock"),
	commandMenu: Symbol("commandMenu"),
	embed: Symbol("embed"),
	emoji: Symbol("emoji"),
	emptyMedia: Symbol("emptyMedia"),
	findReplace: Symbol("findReplace"),
	formatting: Symbol("formatting"),
	image: Symbol("image"),
	lineHandler: Symbol("lineHandler"),
	link: Symbol("link"),
	list: Symbol("list"),
	markdown: Symbol("markdown"),
	mention: Symbol("mention"),
	readOnly: Symbol("readOnly"),
	separator: Symbol("separator"),
	shortcuts: Symbol("shortcuts"),
	symbols: Symbol("symbols"),
	table: Symbol("table"),
	templateVariable: Symbol("templateVariable"),
	todoList: Symbol("todoList"),
	undoRedo: Symbol("undoRedo"),
	video: Symbol("video"),
} as const;
