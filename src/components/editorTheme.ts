import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

const view = EditorView.theme(
  {
    "&": { backgroundColor: "var(--color-bg-sunken)", color: "#e6e9f0" },
    ".cm-content": { caretColor: "#f2b84b", padding: "12px 0" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#f2b84b" },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#2a3754 !important",
    },
    ".cm-activeLine": { backgroundColor: "#ffffff06" },
    ".cm-gutters": { backgroundColor: "var(--color-bg-sunken)", color: "#737e98", border: "none" },
    ".cm-activeLineGutter": { backgroundColor: "transparent", color: "#e6e9f0" },
    ".cm-matchingBracket": { backgroundColor: "#f2b84b22", outline: "1px solid #f2b84b55" },
    ".cm-tooltip": { backgroundColor: "#131a2b", border: "1px solid #263045" },
    ".cm-tooltip-autocomplete > ul > li[aria-selected]": { backgroundColor: "#263045", color: "#e6e9f0" },
    ".cm-lineNumbers .cm-gutterElement": { padding: "0 10px 0 14px" },
  },
  { dark: true },
);

const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.moduleKeyword, t.operatorKeyword], color: "#c792ea" },
  { tag: [t.definitionKeyword, t.modifier], color: "#c792ea" },
  { tag: [t.string, t.special(t.string), t.regexp], color: "#c3e88d" },
  { tag: [t.number, t.bool, t.null, t.atom], color: "#f78c6c" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "#7d89a6", fontStyle: "italic" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#82aaff" },
  { tag: [t.definition(t.variableName), t.definition(t.function(t.variableName))], color: "#f2b84b" },
  { tag: [t.className, t.typeName], color: "#ffcb6b" },
  { tag: [t.propertyName], color: "#89ddff" },
  { tag: [t.operator, t.punctuation, t.bracket], color: "#a6accd" },
  { tag: [t.self, t.special(t.variableName)], color: "#ff5370" },
]);

export const brushTheme = [view, syntaxHighlighting(highlight)];
