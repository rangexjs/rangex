import type { RangeXEditor } from "@rangex/editor";
import type { SourceResolveDetail } from "@rangex/editor/source-placeholder";

export interface ValidateSourceAttrsParams {
  editor: RangeXEditor;
  detail: SourceResolveDetail;
}
