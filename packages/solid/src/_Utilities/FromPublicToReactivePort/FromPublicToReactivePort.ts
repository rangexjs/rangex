import type {
	AccordionItemPublicPort,
	AudioPublicPort,
	BlockQuotePublicPort,
	CodeBlockPublicPort,
	CommandMenuPublicPort,
	EmbedPublicPort,
	EmojiPublicPort,
	EmptyMediaPublicPort,
	FindReplacePublicPort,
	ImagePublicPort,
	LinkPublicPort,
	ListPublicPort,
	MentionPublicPort,
	ReadOnlyPublicPort,
	SeparatorPublicPort,
	SymbolsPublicPort,
	TablePublicPort,
	TemplateVariablePublicPort,
	TodoListPublicPort,
	UndoRedoPublicPort,
	VideoPublicPort,
} from "@rangex/editor";
import type { ReactiveAccordionItemPort } from "../../ReactivePorts/AccordionItem";
import type { ReactiveAudioPort } from "../../ReactivePorts/Audio";
import type { ReactiveBlockQuotePort } from "../../ReactivePorts/BlockQuote";
import type { ReactiveCodeBlockPort } from "../../ReactivePorts/CodeBlock";
import type { ReactiveCommandMenuPort } from "../../ReactivePorts/CommandMenu";
import type { ReactiveEmbedPort } from "../../ReactivePorts/Embed";
import type { ReactiveEmojiPort } from "../../ReactivePorts/Emoji";
import type { ReactiveEmptyMediaPort } from "../../ReactivePorts/EmptyMedia";
import type { ReactiveFindReplacePort } from "../../ReactivePorts/FindReplace";
import type { ReactiveImagePort } from "../../ReactivePorts/Image";
import type { ReactiveLinkPort } from "../../ReactivePorts/Link";
import type { ReactiveListPort } from "../../ReactivePorts/List";
import type { ReactiveMentionPort } from "../../ReactivePorts/Mention";
import type { ReactiveReadOnlyPort } from "../../ReactivePorts/ReadOnly";
import type { ReactiveSeparatorPort } from "../../ReactivePorts/Separator";
import type { ReactiveSymbolsPort } from "../../ReactivePorts/Symbols";
import type { ReactiveTablePort } from "../../ReactivePorts/Table";
import type { ReactiveTemplateVariablePort } from "../../ReactivePorts/TemplateVariable";
import type { ReactiveTodoListPort } from "../../ReactivePorts/TodoList";
import type { ReactiveUndoRedoPort } from "../../ReactivePorts/UndoRedo";
import type { ReactiveVideoPort } from "../../ReactivePorts/Video";

/**
 * Maps a `*PublicPort` (from `@rangex/editor`) to its `Reactive*Port` twin. Distributes over
 * `T | undefined`, so a `*PublicPort | undefined` input yields `Reactive*Port | undefined`, and a
 * definite `*PublicPort` input yields a definite `Reactive*Port` — no `undefined` in the result.
 *
 * `FormattingPublicPort` has no entry here — multiple ReactivePorts (Bold, FontSize, ...) share
 * that one input type, which this one-to-one map can't distinguish; see
 * `FromFormattingToReactivePort` in `ReactivePorts/Formatting/_Utilities` instead.
 */
export type FromPublicToReactivePort<T> = T extends AccordionItemPublicPort
	? ReactiveAccordionItemPort
	: T extends AudioPublicPort
		? ReactiveAudioPort
		: T extends BlockQuotePublicPort
			? ReactiveBlockQuotePort
			: T extends CodeBlockPublicPort
				? ReactiveCodeBlockPort
				: T extends CommandMenuPublicPort
					? ReactiveCommandMenuPort
					: T extends EmbedPublicPort
						? ReactiveEmbedPort
						: T extends EmojiPublicPort
							? ReactiveEmojiPort
							: T extends EmptyMediaPublicPort
								? ReactiveEmptyMediaPort
								: T extends FindReplacePublicPort
									? ReactiveFindReplacePort
									: T extends ImagePublicPort
										? ReactiveImagePort
										: T extends LinkPublicPort
											? ReactiveLinkPort
											: T extends ListPublicPort
												? ReactiveListPort
												: T extends MentionPublicPort
													? ReactiveMentionPort
													: T extends ReadOnlyPublicPort
														? ReactiveReadOnlyPort
														: T extends SeparatorPublicPort
															? ReactiveSeparatorPort
															: T extends SymbolsPublicPort
																? ReactiveSymbolsPort
																: T extends TablePublicPort
																	? ReactiveTablePort
																	: T extends TemplateVariablePublicPort
																		? ReactiveTemplateVariablePort
																		: T extends TodoListPublicPort
																			? ReactiveTodoListPort
																			: T extends UndoRedoPublicPort
																				? ReactiveUndoRedoPort
																				: T extends VideoPublicPort
																					? ReactiveVideoPort
																					: undefined;
