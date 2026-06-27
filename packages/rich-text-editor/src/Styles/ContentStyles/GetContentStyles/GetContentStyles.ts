import blockQuote from "../BlockQuote.css?inline";
import codeBlock from "../CodeBlock.css?inline";
import collapsible from "../Collapsible.css?inline";
import contentLine from "../ContentLine.css?inline";
import globalContentStyles from "../GlobalContentStyles.css?inline";
import glyphFormatter from "../GlyphFormatter.css?inline";
import link from "../Link.css?inline";
import list from "../List.css?inline";
import mention from "../Mention.css?inline";
import table from "../Table.css?inline";
import templateVariable from "../TemplateVariable.css?inline";
import todoList from "../TodoList.css?inline";

export const getContentStyles = () => {
	const styles =
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
