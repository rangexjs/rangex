import type { RangeXEditor } from "@rangex/editor";
import { Dynamic } from "@solidjs/web";
import { type Component, For } from "solid-js";
import type { ToolbarButtonsLayout } from "#constants";
import type { UIOptions } from "#context";
import { EditorContext, UIOptionsContext } from "#context";
import type { ExtensionComponents } from "#extensions";
import { EditorToolbar } from "./EditorToolbar";

export interface AppProps {
	components: ExtensionComponents;
	uiOptions: UIOptions;
	toolbarButtonsLayout: ToolbarButtonsLayout;
	editor: RangeXEditor;
	host: HTMLElement;
	floatingContainer: HTMLDivElement;
}

export const App: Component<AppProps> = (props) => {
	return (
		<EditorContext value={props.editor}>
			<UIOptionsContext value={props.uiOptions}>
				<div>
					<EditorToolbar
						toolbarButtonsLayout={props.toolbarButtonsLayout}
						toolbarButtons={props.components.toolbarButtons}
					/>
					<div>{[props.host, props.floatingContainer]}</div>
					<For each={props.components.floatingComponents}>
						{(FloatingComponent) => <Dynamic component={FloatingComponent} />}
					</For>
				</div>
			</UIOptionsContext>
		</EditorContext>
	);
};
