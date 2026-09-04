import type { SolidEditor } from "@rangex/solid";
import type { Component } from "solid-js";

export interface AppProps {
	editor: SolidEditor;
	host: HTMLElement;
	floatingContainer: HTMLDivElement;
}

export const App: Component<AppProps> = (props) => {
	return (
		<div>
			<div>{[props.host, props.floatingContainer]}</div>
		</div>
	);
};
