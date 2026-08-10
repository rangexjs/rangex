import { PreviewMenu } from "./Preview";
// import { SettingsMenu } from "./Settings";
// import { TemplateMenu } from "./Template";
import { ViewMenu } from "./View";

export const MenuBar = () => {
	return (
		<div class="flex items-center gap-1 border-neutral-200 border-b bg-white px-2 py-1 dark:border-neutral-800 dark:bg-neutral-950">
			<ViewMenu />
			{/* <TemplateMenu /> */}
			{/* <SettingsMenu /> */}
			<PreviewMenu />
		</div>
	);
};
