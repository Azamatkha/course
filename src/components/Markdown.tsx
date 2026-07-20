import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { CodeBlock } from "./CodeBlock";
import { Mermaid } from "./Mermaid";

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
