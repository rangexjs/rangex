import type { RangeXEditor } from "@rangex/editor";
import type { SolidEditor } from "../RangeXEditor-types";

export interface WireReactivePortsParams {
	editor: RangeXEditor;
	solidEditor: SolidEditor;
	disposeList: Set<() => void>;
}
