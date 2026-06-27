import colors from "../Colors.css?inline";
import blockQuote from "../Components/BlockQuote.css?inline";
import codeBlock from "../Components/CodeBlock.css?inline";
import collapsible from "../Components/Collapsible.css?inline";
import link from "../Components/Link.css?inline";
import list from "../Components/List.css?inline";
import mention from "../Components/Mention.css?inline";
import table from "../Components/Table.css?inline";
import templateVariable from "../Components/TemplateVariable.css?inline";
import todoList from "../Components/TodoList.css?inline";
import contentLine from "../EditorElements/ContentLine.css?inline";
import glyphFormatter from "../EditorElements/GlyphFormatter.css?inline";
import globalContentStyles from "../GlobalContentStyles.css?inline";

export const getContentStyles = () => {
	const styles =
		colors +
		globalContentStyles +
		contentLine +
		blockQuote +
		codeBlock +
		collapsible +
		link +
		list +
		todoList +
		mention +
		table +
		templateVariable +
		glyphFormatter;

	return styles;
};
