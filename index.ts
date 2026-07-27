import { createDevelopmentView } from "./src/CreateDevelopmentView";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root can't be null.");
}

const developmentView = createDevelopmentView();

root.append(developmentView);
