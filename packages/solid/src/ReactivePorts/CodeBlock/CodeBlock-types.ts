import type { CodeBlockTheme } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveCodeBlockPort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	isActive: Accessor<boolean>;
	language: Accessor<string | null>;
	theme: Accessor<CodeBlockTheme | null>;
	currentComponent: Accessor<HTMLElement | null>;
}
