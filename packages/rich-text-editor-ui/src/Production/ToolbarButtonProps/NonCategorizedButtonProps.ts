// FindReplace
export interface FindReplaceSearchResult {
	segmentText: string;
	matchStart: number;
	matchEnd: number;
}

export interface FindReplaceToolbarButtonState {
	currentIndex: number;
	totalResults: number;
	results: FindReplaceSearchResult[];
}

// TextAreaReadability
export interface TextAreaReadabilityToolbarButtonState {
	checked: boolean;
}
