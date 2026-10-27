import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { NotFoundView } from "./NotFound";

export function RouteError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundView />;
  const message = error instanceof Error ? error.message : "Unknown error";
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold text-danger">Something broke</h1>
      <pre className="mx-auto mt-4 max-w-xl whitespace-pre-wrap text-left font-mono text-sm text-text-muted">
        {message}
      </pre>
      <Link to="/" className="btn btn-primary mt-6">
        Back to the dashboard
      </Link>
    </div>
  );
}
