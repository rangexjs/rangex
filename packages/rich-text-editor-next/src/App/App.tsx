import type { RangeXEditor } from "@rangex/editor";
import type { ReactiveEditor } from "@rangex/solid";
import { Dynamic } from "@solidjs/web";
import { type Component, For } from "solid-js";
import type { ToolbarButtonsLayout } from "#constants";
import { EditorContext, ReactiveEditorContext } from "#context";
import type { ExtensionComponents } from "#extensions";
import { EditorToolbar } from "./EditorToolbar";

export interface AppProps {
	components: ExtensionComponents;
	toolbarButtonsLayout: ToolbarButtonsLayout;
	editor: RangeXEditor;
	reactiveEditor: ReactiveEditor;
	host: HTMLElement;
	floatingContainer: HTMLDivElement;
}

export const App: Component<AppProps> = (props) => {
	return (
		<EditorContext value={props.editor}>
			<ReactiveEditorContext value={props.reactiveEditor}>
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
			</ReactiveEditorContext>
		</EditorContext>
	);
};
