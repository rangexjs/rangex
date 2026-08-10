import type {
	AccordionItemUIPort,
	AudioUIPort,
	BlockQuoteUIPort,
	CodeBlockUIPort,
	CommandMenuUIPort,
	EmbedUIPort,
	EmojiUIPort,
	EmptyMediaUIPort,
	FindReplaceUIPort,
	FormattingUIPort,
	ImageUIPort,
	LineHandlerUIPort,
	LinkUIPort,
	ListUIPort,
	MentionUIPort,
	ReadOnlyUIPort,
	SeparatorUIPort,
	SymbolsUIPort,
	TableUIPort,
	TemplateVariableUIPort,
	TodoListUIPort,
	UndoRedoUIPort,
	VideoUIPort,
} from "#adapters";
import { adapterIds } from "#ports";
import type { UIPortsContextValue } from "#ui";
import type { BuildUIPortsParams } from "./BuildUIPorts-types";

/**
 * Routes each Adapter by its `id` (see `Ports/AdapterIds`) instead of `instanceof` against its
 * concrete class — matching a class forces a bundler to keep it even for extensions the consumer
 * never opted into, defeating tree-shaking. Only type-only `XxxUIPort` imports are needed for the
 * cast below (erased at build time), no Adapter class value import at all.
 *
 * TypeScript can't narrow `adapter`'s type from an `id` equality check here — `unique symbol`
 * identity doesn't survive from an Adapter's own (different) module into this one for a plain
 * instance field — so each branch casts explicitly instead of relying on control-flow narrowing.
 */
export const buildUIPorts = ({
	adapters,
}: BuildUIPortsParams): UIPortsContextValue => {
	const uiPorts: UIPortsContextValue = {
		accordionItemUIPort: null,
		audioUIPort: null,
		blockQuoteUIPort: null,
		codeBlockUIPort: null,
		commandMenuUIPort: null,
		embedUIPort: null,
		emojiUIPort: null,
		emptyMediaUIPort: null,
		findReplaceUIPort: null,
		formattingUIPort: null,
		imageUIPort: null,
		lineHandlerUIPort: null,
		linkUIPort: null,
		listUIPort: null,
		mentionUIPort: null,
		readOnlyUIPort: null,
		separatorUIPort: null,
		symbolsUIPort: null,
		tableUIPort: null,
		templateVariableUIPort: null,
		todoListUIPort: null,
		undoRedoUIPort: null,
		videoUIPort: null,
	};

	for (const adapter of adapters) {
		if (adapter.id === adapterIds.accordionItem) {
			uiPorts.accordionItemUIPort = adapter.uiPort as AccordionItemUIPort;
		}

		if (adapter.id === adapterIds.audio) {
			uiPorts.audioUIPort = adapter.uiPort as AudioUIPort;
		}

		if (adapter.id === adapterIds.blockQuote) {
			uiPorts.blockQuoteUIPort = adapter.uiPort as BlockQuoteUIPort;
		}

		if (adapter.id === adapterIds.codeBlock) {
			uiPorts.codeBlockUIPort = adapter.uiPort as CodeBlockUIPort;
		}

		if (adapter.id === adapterIds.commandMenu) {
			uiPorts.commandMenuUIPort = adapter.uiPort as CommandMenuUIPort;
		}

		if (adapter.id === adapterIds.embed) {
			uiPorts.embedUIPort = adapter.uiPort as EmbedUIPort;
		}

		if (adapter.id === adapterIds.emoji) {
			uiPorts.emojiUIPort = adapter.uiPort as EmojiUIPort;
		}

		if (adapter.id === adapterIds.emptyMedia) {
			uiPorts.emptyMediaUIPort = adapter.uiPort as EmptyMediaUIPort;
		}

		if (adapter.id === adapterIds.findReplace) {
			uiPorts.findReplaceUIPort = adapter.uiPort as FindReplaceUIPort;
		}

		if (adapter.id === adapterIds.formatting) {
			uiPorts.formattingUIPort = adapter.uiPort as FormattingUIPort;
		}

		if (adapter.id === adapterIds.image) {
			uiPorts.imageUIPort = adapter.uiPort as ImageUIPort;
		}

		if (adapter.id === adapterIds.lineHandler) {
			uiPorts.lineHandlerUIPort = adapter.uiPort as LineHandlerUIPort;
		}

		if (adapter.id === adapterIds.link) {
			uiPorts.linkUIPort = adapter.uiPort as LinkUIPort;
		}

		if (adapter.id === adapterIds.list) {
			uiPorts.listUIPort = adapter.uiPort as ListUIPort;
		}

		if (adapter.id === adapterIds.mention) {
			uiPorts.mentionUIPort = adapter.uiPort as MentionUIPort;
		}

		if (adapter.id === adapterIds.readOnly) {
			uiPorts.readOnlyUIPort = adapter.uiPort as ReadOnlyUIPort;
		}

		if (adapter.id === adapterIds.separator) {
			uiPorts.separatorUIPort = adapter.uiPort as SeparatorUIPort;
		}

		if (adapter.id === adapterIds.symbols) {
			uiPorts.symbolsUIPort = adapter.uiPort as SymbolsUIPort;
		}

		if (adapter.id === adapterIds.table) {
			uiPorts.tableUIPort = adapter.uiPort as TableUIPort;
		}

		if (adapter.id === adapterIds.templateVariable) {
			uiPorts.templateVariableUIPort = adapter.uiPort as TemplateVariableUIPort;
		}

		if (adapter.id === adapterIds.todoList) {
			uiPorts.todoListUIPort = adapter.uiPort as TodoListUIPort;
		}

		if (adapter.id === adapterIds.undoRedo) {
			uiPorts.undoRedoUIPort = adapter.uiPort as UndoRedoUIPort;
		}

		if (adapter.id === adapterIds.video) {
			uiPorts.videoUIPort = adapter.uiPort as VideoUIPort;
		}
	}

	return uiPorts;
};
