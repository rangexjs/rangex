import type { LanguageRegistration, ThemeRegistrationAny } from "shiki/types";

export interface CreateHTMLViewHighlighterParams {
	langs: LanguageRegistration[][];
	themes: ThemeRegistrationAny[];
}
