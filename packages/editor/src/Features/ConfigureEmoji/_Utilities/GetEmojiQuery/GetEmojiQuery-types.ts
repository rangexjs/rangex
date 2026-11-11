import type { GetCaretMenuQueryParams, GetCaretMenuQueryResult } from "../../../_Utilities";

export interface GetEmojiQueryParams extends GetCaretMenuQueryParams {
	hasClosingColon: boolean;
}

export type GetEmojiQueryResult = GetCaretMenuQueryResult;
