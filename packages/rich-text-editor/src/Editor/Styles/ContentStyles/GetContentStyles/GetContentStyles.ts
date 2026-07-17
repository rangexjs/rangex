import colors from "../Colors.css?inline";
import blockQuote from "../Components/BlockQuote.css?inline";
import codeBlock from "../Components/CodeBlock.css?inline";
import collapsible from "../Components/Collapsible.css?inline";
import embed from "../Components/Embed.css?inline";
import image from "../Components/Image.css?inline";
import link from "../Components/Link.css?inline";
import list from "../Components/List.css?inline";
import mention from "../Components/Mention.css?inline";
import table from "../Components/Table.css?inline";
import templateVariable from "../Components/TemplateVariable.css?inline";
import todoList from "../Components/TodoList.css?inline";
import video from "../Components/Video.css?inline";
import blockNestedContextLine from "../EditorElements/BlockNestedContextLine.css?inline";
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
		embed +
		image +
		link +
		list +
		todoList +
		blockNestedContextLine +
		mention +
		table +
		templateVariable +
		video +
		glyphFormatter;

	return styles;
};
