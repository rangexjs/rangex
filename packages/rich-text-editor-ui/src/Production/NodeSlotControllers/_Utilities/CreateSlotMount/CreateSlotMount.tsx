import { createStore } from "solid-js/store";
import { Dynamic, render } from "solid-js/web";
import type {
	CreateSlotMountParams,
	CreateSlotMountResult,
} from "./CreateSlotMount-types";

/**
 * Generic mount/update/dispose primitive for rendering a Solid component into a container
 * that lives outside `RichTextEditorUI`'s own render tree (e.g. a node appended into the
 * engine's light DOM). Any NodeSlotController can reuse this.
 */
export const createSlotMount = <Props extends object>({
	component,
	container,
	initialProps,
}: CreateSlotMountParams<Props>): CreateSlotMountResult<Props> => {
	const [store, setStore] = createStore(initialProps);

	const dispose = render(
		() => <Dynamic component={component} {...store} />,
		container,
	);

	return {
		update: (props) => setStore((current) => ({ ...current, ...props })),
		dispose,
	};
};
