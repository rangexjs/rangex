export interface MenuButtonItem {
	type: "button";
	label: string;
	checked: () => boolean | undefined;
	onClick: () => void;
}

export interface MenuSubmenuItem {
	type: "submenu";
	label: string;
	items: MenuItem[];
}

export type MenuItem = MenuButtonItem | MenuSubmenuItem;

export interface MenuProps {
	ref?: HTMLDivElement;
	mainPopoverId: string;
	popoverId: string;
	items: MenuItem[];
}
