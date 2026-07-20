import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/engine/theme";

let seq = 0;

/** Renders a mermaid diagram; the library is loaded lazily on first use. */
export function Mermaid({ chart }: { chart: string }) {
  const { theme } = useTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const idRef = useRef(`mmd-${++seq}`);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "neutral",
          fontFamily: "Inter, sans-serif",
          securityLevel: "strict",
        });
        const { svg } = await mermaid.render(
          `${idRef.current}-${theme}`,
          chart
        );
        if (!cancelled) setSvg(svg);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, theme]);

  if (failed) {
    return (
      <pre className="my-5 overflow-x-auto rounded-xl border border-line bg-surface-sunken p-4 font-mono text-sm">
        {chart}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="my-5 flex h-40 animate-pulse items-center justify-center rounded-xl border border-line bg-surface-sunken text-sm text-ink-faint">
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className="my-5 flex justify-center overflow-x-auto rounded-xl border border-line bg-surface-raised p-4 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
