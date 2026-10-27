// Lazily imported: CodeMirror stays out of the dashboard bundle.
import { javascript } from "@codemirror/lang-javascript";
import { indentUnit } from "@codemirror/language";
import { EditorState, Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useMemo, useRef } from "react";
import { brushTheme } from "./editorTheme";

export interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  label: string;
  minHeight?: string;
}

export default function Editor({
  value,
  onChange,
  onRun,
  readOnly = false,
  label,
  minHeight = "220px",
}: EditorProps) {
  const runRef = useRef(onRun);
  useEffect(() => {
    runRef.current = onRun;
  }, [onRun]);

  // The keymap reads runRef only when the key is pressed, never during render.
  /* eslint-disable react-hooks/refs */
  const extensions = useMemo(
    () => [
      javascript(),
      brushTheme,
      indentUnit.of("  "),
      EditorView.contentAttributes.of({ "aria-label": label }),
      EditorState.tabSize.of(2),
      Prec.highest(
        keymap.of([
          {
            key: "Mod-Enter",
            run: () => {
              runRef.current?.();
              return true;
            },
          },
        ]),
      ),
    ],
    [label],
  );
  /* eslint-enable react-hooks/refs */

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      readOnly={readOnly}
      editable={!readOnly}
      theme="none"
      minHeight={minHeight}
      basicSetup={{
        foldGutter: false,
        highlightActiveLine: !readOnly,
        highlightActiveLineGutter: !readOnly,
        autocompletion: !readOnly,
        indentOnInput: true,
        tabSize: 2,
      }}
      indentWithTab
    />
  );
}
