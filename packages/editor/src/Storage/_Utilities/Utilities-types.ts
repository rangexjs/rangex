import type { AccordionItemStorage } from "../AccordionItem";
import type { AudioStorage } from "../Audio";
import type { BlockQuoteStorage } from "../BlockQuote";
import type { CodeBlockStorage } from "../CodeBlock";
import type { EmbedStorage } from "../Embed";
import type { EmptyMediaStorage } from "../EmptyMedia";
import type { ImageStorage } from "../Image";
import type { LinkStorage } from "../Link";
import type { ListStorage } from "../List";
import type { MentionStorage } from "../Mention";
import type { RootStorage } from "../Root";
import type { SeparatorStorage } from "../Separator";
import type { TableStorage } from "../Table";
import type { TemplateVariableStorage } from "../TemplateVariable";
import type { TodoCheckboxStorage, TodoListStorage } from "../TodoList";
import type { VideoStorage } from "../Video";

export interface IsStorageParams {
	id: string;
}

export type ValidateStorageCallbackFn = (storage: unknown) => boolean;

export type NodeStorage =
	| AccordionItemStorage
	| AudioStorage
	| BlockQuoteStorage
	| CodeBlockStorage
	| EmbedStorage
	| EmptyMediaStorage
	| ImageStorage
	| LinkStorage
	| ListStorage
	| MentionStorage
	| RootStorage
	| SeparatorStorage
	| TableStorage
	| TemplateVariableStorage
	| TodoCheckboxStorage
	| TodoListStorage
	| VideoStorage;
