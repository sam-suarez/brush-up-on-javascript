import { Link } from "react-router";

export function NotFoundView() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold text-accent">404 — that challenge doesn't exist</h1>
      <p className="mt-3 text-text-muted">The link may be mistyped, or the content moved.</p>
      <Link to="/" className="btn btn-primary mt-6">
        Back to the dashboard
      </Link>
    </div>
  );
}

export function Component() {
  return <NotFoundView />;
}
