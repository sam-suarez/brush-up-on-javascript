import { Fragment } from "react";
import { Link } from "react-router";
import { ChevronRightIcon } from "./Icons";

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-text-muted">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <ChevronRightIcon size={14} />}
          {item.to ? (
            <Link to={item.to} className="hover:text-text">
              {item.label}
            </Link>
          ) : (
            <span className="text-text" aria-current="page">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
