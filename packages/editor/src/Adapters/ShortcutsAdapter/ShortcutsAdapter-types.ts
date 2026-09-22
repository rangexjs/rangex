import type { CreateAdapterParams } from "../_Utilities";

export interface ShortcutsConfigPortProps {}

export interface ShortcutsConfigPort extends ShortcutsConfigPortProps {}

export interface ShortcutsPublicPortProps {}

export interface ShortcutsPublicPort extends ShortcutsPublicPortProps {}

export interface ShortcutsAdapter {
	configPort: ShortcutsConfigPort;
	publicPort: ShortcutsPublicPort;
}

export interface ShortcutsSettings {}

export interface CreateShortcutsAdapterParams
	extends CreateAdapterParams<ShortcutsSettings> {}

export interface CreateShortcutsAdapterResult extends ShortcutsAdapter {}
