import type { StructuredStyleValue } from "@rangex/core";
import type { JSONPattern } from "#utilities";

export interface IsStructuredStyleOfParams<
	TStructuredStyle extends StructuredStyleValue,
> {
	structuredStyle: StructuredStyleValue;
	type: TStructuredStyle["type"];
	valuesPattern: JSONPattern<TStructuredStyle["values"]>;
	createStructuredStyle: (
		values: TStructuredStyle["values"],
	) => TStructuredStyle;
}

export type IsStructuredStyleOfResult = boolean;
