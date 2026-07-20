import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="font-mono text-6xl font-bold text-ink-faint">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 text-ink-soft">
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
