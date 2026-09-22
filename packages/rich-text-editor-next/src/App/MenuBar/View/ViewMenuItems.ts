import type { MenuItem } from "../_Utilities";
import type { CreateViewMenuItemsParams } from "./ViewMenuItems-types";

export const createViewMenuItems = ({
	theme,
	onThemeChange,
}: CreateViewMenuItemsParams): MenuItem[] => [
	{
		type: "submenu",
		label: "Theme",
		items: [
			{
				type: "button",
				label: "Light",
				checked: () => theme() === "light",
				onClick: () => onThemeChange("light"),
			},
			{
				type: "button",
				label: "Dark",
				checked: () => theme() === "dark",
				onClick: () => onThemeChange("dark"),
			},
			{
				type: "button",
				label: "System",
				checked: () => theme() === "system",
				onClick: () => onThemeChange("system"),
			},
		],
	},
];
