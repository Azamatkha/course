import { memo, isValidElement, cloneElement, Children, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Info, Lightbulb, AlertTriangle, TriangleAlert, Flame } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { Mermaid } from "./Mermaid";

type AlertKind = "note" | "tip" | "warning" | "important" | "caution";

const ALERTS: Record<AlertKind, { label: string; icon: typeof Info }> = {
  note: { label: "Note", icon: Info },
  tip: { label: "Tip", icon: Lightbulb },
  warning: { label: "Warning", icon: AlertTriangle },
  important: { label: "Important", icon: TriangleAlert },
  caution: { label: "Caution", icon: Flame },
};

/** Flatten a React node tree into its plain text — used to sniff the alert marker. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
  return "";
}

/** Remove the leading `[!TYPE]` marker (and following break) from the blockquote's first paragraph. */
function stripMarker(children: ReactNode): ReactNode {
  let done = false;
  const clean = (node: ReactNode): ReactNode => {
    if (done) return node;
    if (typeof node === "string") {
      const replaced = node.replace(/^\s*\[!\w+\]\s*\n?/, "");
      if (replaced !== node) done = true;
      return replaced;
    }
    if (Array.isArray(node)) return node.map(clean);
    if (isValidElement(node)) {
      const props = node.props as { children?: ReactNode };
      return cloneElement(node, {}, clean(props.children));
    }
    return node;
  };
  return Children.map(children, clean);
}

export const Markdown = memo(function Markdown({ body }: { body: string }) {
  return (
    <div className="prose-lesson">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className ?? "");
            const text = String(children);
            if (match) {
              if (match[1] === "mermaid") return <Mermaid chart={text} />;
              return <CodeBlock language={match[1]} code={text} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // GitHub-style alert callouts: > [!NOTE] / [!TIP] / [!WARNING] / …
          blockquote({ children }) {
            const marker = /^\s*\[!(\w+)\]/.exec(textOf(children));
            const kind = marker?.[1].toLowerCase() as AlertKind | undefined;
            if (kind && kind in ALERTS) {
              const { label, icon: Icon } = ALERTS[kind];
              return (
                <div className={`callout callout-${kind}`}>
                  <p className="callout-title">
                    <Icon className="h-4 w-4" />
                    {label}
                  </p>
                  <div className="callout-body">{stripMarker(children)}</div>
                </div>
              );
            }
            return <blockquote>{children}</blockquote>;
          },
          table({ children }) {
            return (
              <div className="table-wrap">
                <table>{children}</table>
              </div>
            );
          },
          // react-markdown wraps block code in <pre>; CodeBlock brings its own.
          pre({ children }) {
            return <>{children}</>;
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
});
