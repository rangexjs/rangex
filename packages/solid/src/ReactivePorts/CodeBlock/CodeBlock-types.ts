import type { CodeBlockLanguage, CodeBlockTheme } from "@rangex/editor";
import type { Accessor } from "solid-js";
import type { ReactiveQuickActionsPort } from "../../_Utilities";

export interface PlacementOption {
	language: CodeBlockLanguage;
}

export interface InsertParams extends PlacementOption {}

export interface WrapParams extends PlacementOption {}

export interface ReactiveCodeBlockPort {
	readonly quickActions: ReactiveQuickActionsPort;
	readonly languages: CodeBlockLanguage[];
	readonly themes: CodeBlockTheme[];

	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	isActive: Accessor<boolean>;
	language: Accessor<CodeBlockLanguage>;
	lightTheme: Accessor<CodeBlockTheme>;
	darkTheme: Accessor<CodeBlockTheme>;
	currentBlock: Accessor<HTMLElement | null>;

	insert(params: InsertParams): void;
	wrap(params: WrapParams): void;
	changeLanguage(language: CodeBlockLanguage): void;
	changeLightTheme(theme: CodeBlockTheme): void;
	changeDarkTheme(theme: CodeBlockTheme): void;
	remove(): void;
	unwrap(): void;

	getPlainText(): string[];
}
