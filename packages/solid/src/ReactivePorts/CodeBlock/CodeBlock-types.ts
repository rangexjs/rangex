import type { CodeBlockLanguage, CodeBlockTheme } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveCodeBlockPort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	isActive: Accessor<boolean>;
	language: Accessor<CodeBlockLanguage>;
	lightTheme: Accessor<CodeBlockTheme>;
	darkTheme: Accessor<CodeBlockTheme>;
	currentComponent: Accessor<HTMLElement | null>;
}
