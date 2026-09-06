import type { SolidEditor } from "@rangex/solid";
import type { Component } from "solid-js";
import type { ToolbarButtonsLayout } from "#constants";
import { EditorContext } from "#context";
import type { ExtensionComponents } from "#extensions";
import { EditorToolbar } from "./EditorToolbar";

export interface AppProps {
	components: ExtensionComponents;
	toolbarButtonsLayout: ToolbarButtonsLayout;
	editor: SolidEditor;
	host: HTMLElement;
	floatingContainer: HTMLDivElement;
}

export const App: Component<AppProps> = (props) => {
	return (
		<div>
			<EditorContext value={props.editor}>
				<EditorToolbar
					toolbarButtonsLayout={props.toolbarButtonsLayout}
					toolbarButtons={props.components.toolbarButtons}
				/>
			</EditorContext>
			<div>{[props.host, props.floatingContainer]}</div>
		</div>
	);
};
