import { defineRangeX } from "rich-text-area";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root can't be null.");
}

console.log(defineRangeX);
