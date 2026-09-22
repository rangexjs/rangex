import { createMemo } from "solid-js";

export interface ToggleButtonProps {
	checked: boolean;
	onClick?: () => void;
}

export const ToggleButton = (props: ToggleButtonProps) => {
	const toggleButtonAnchor = "--toggle-button-anchor";

	const circleSize = 18;

	const leftPosition = createMemo(() =>
		props.checked
			? `calc(anchor(right) - ${circleSize * 0.8}px)`
			: `calc(anchor(left) - ${circleSize * 0.2}px)`,
	);

	return (
		<button
			type="button"
			class="toggle-button"
			aria-pressed={`${props.checked}`}
			style={{
				"anchor-scope": toggleButtonAnchor,
				"anchor-name": toggleButtonAnchor,
			}}
			onClick={props.onClick}
		>
			<span
				class="[align-self:anchor-center]"
				style={{
					"position-anchor": toggleButtonAnchor,
					width: `${circleSize}px`,
					height: `${circleSize}px`,
					left: leftPosition(),
				}}
			/>
		</button>
	);
};
