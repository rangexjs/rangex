import type {
	LanguageRegistration,
	ThemeRegistrationAny,
} from "@shikijs/types";

export interface CreateHTMLViewHighlighterParams {
	langs: LanguageRegistration[][];
	themes: ThemeRegistrationAny[];
}
