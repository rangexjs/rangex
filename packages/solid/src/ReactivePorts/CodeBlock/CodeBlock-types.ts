import type { CodeBlockLanguage, CodeBlockTheme } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface PlacementOption {
	language: CodeBlockLanguage;
}

export interface InsertParams extends PlacementOption {}

export interface WrapParams extends PlacementOption {}

export interface ReactiveCodeBlockPort {
	readonly floatingEl: HTMLDivElement;
	readonly languages: CodeBlockLanguage[];
	readonly themes: CodeBlockTheme[];

	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	isActive: Accessor<boolean>;
	language: Accessor<CodeBlockLanguage>;
	lightTheme: Accessor<CodeBlockTheme>;
	darkTheme: Accessor<CodeBlockTheme>;
	isOpen: Accessor<boolean>;

	insert(params: InsertParams): void;
	wrap(params: WrapParams): void;
	changeLanguage(language: CodeBlockLanguage): void;
	changeLightTheme(theme: CodeBlockTheme): void;
	changeDarkTheme(theme: CodeBlockTheme): void;
	remove(): void;
	unwrap(): void;

	getPlainText(): string[];
}

export interface ReactiveCodeBlockResult {
	port: ReactiveCodeBlockPort;
	dispose: () => void;
}
