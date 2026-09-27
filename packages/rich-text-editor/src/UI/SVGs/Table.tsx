import { omit } from "solid-js";
import type { SVGProps } from "./_Utilities";

export const Table = (props: SVGProps) => {
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
				d="M23.0769 2H0.923077C0.678262 2 0.443473 2.10009 0.270363 2.27825C0.0972524 2.45641 0 2.69804 0 2.95V19.1C0 19.6039 0.194505 20.0872 0.540726 20.4435C0.886947 20.7998 1.35652 21 1.84615 21H22.1538C22.6435 21 23.1131 20.7998 23.4593 20.4435C23.8055 20.0872 24 19.6039 24 19.1V2.95C24 2.69804 23.9027 2.45641 23.7296 2.27825C23.5565 2.10009 23.3217 2 23.0769 2ZM1.84615 9.6H6.46154V13.4H1.84615V9.6ZM8.30769 9.6H22.1538V13.4H8.30769V9.6ZM22.1538 3.9V7.7H1.84615V3.9H22.1538ZM1.84615 15.3H6.46154V19.1H1.84615V15.3ZM22.1538 19.1H8.30769V15.3H22.1538V19.1Z"
				fill="currentColor"
			/>
		</svg>
	);
};
