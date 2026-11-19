import { initRichTextEditor } from "../InitRichTextEditor";

export const createDevelopmentView = () => {
  const host = document.createElement("div");

  Object.assign<CSSStyleDeclaration, Partial<CSSStyleDeclaration>>(host.style, {
    margin: "60px auto",
    height: "900px",
    maxWidth: "1200px",
  });

  const shadowRoot = host.attachShadow({ mode: "closed" });

  const richTextEditor = initRichTextEditor();

  shadowRoot.adoptedStyleSheets.push(richTextEditor.editorStyle);
  shadowRoot.append(richTextEditor.editorHost);

  return host;
};
