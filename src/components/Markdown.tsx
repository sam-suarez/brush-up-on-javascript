import { marked } from "marked";
import { useMemo } from "react";

// Only our own challenge content is rendered, so the HTML is trusted.
export function Markdown({ source }: { source: string }) {
  const html = useMemo(() => marked.parse(source, { async: false, gfm: true, breaks: false }), [source]);
  return <div className="prose-brush" dangerouslySetInnerHTML={{ __html: html }} />;
}
