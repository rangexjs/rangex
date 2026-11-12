import { omit } from "solid-js";

import type { SVGProps } from "./_Utilities";

export const LetterSpacing = (props: SVGProps) => {
	const svgProps = omit(props, "title");

	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden={`${!props.title}`}
			{...svgProps}
		>
			{props.title && <title>{props.title}</title>}
			<path
				d="M0 22V2H2.11765V22H0ZM21.8824 22V2H24V22H21.8824ZM5.73388 18.6667L10.9736 5.38467H12.9854L18.2661 18.6667H16.2706L14.9619 15.0743H9.04059L7.70224 18.6667H5.73388ZM9.62435 13.5257H14.3485L12.0434 7.35133H12.0162L9.62435 13.5257Z"
				fill="currentColor"
			/>
		</svg>
	);
};
