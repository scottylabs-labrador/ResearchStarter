import React from "react";
import Surface from "./Surface";
import { cx } from "./cx";

export interface DetailRow {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

interface DetailsTableProps {
  rows: DetailRow[];
  className?: string;
}

const DetailsTable = ({ rows, className }: DetailsTableProps) => (
  <Surface className={cx("overflow-hidden", className)}>
    <dl className="m-0 grid grid-cols-[minmax(max-content,32%)_1fr]">
      {rows.map((row) => (
        <div key={row.label} className="contents [&:not(:first-child)>*]:border-t [&>*]:border-hairline">
          <dt className="flex items-center gap-2 whitespace-nowrap border-r px-4 py-3 text-small text-ink-muted">
            {row.icon ? <span className="flex shrink-0">{row.icon}</span> : null}
            {row.label}
          </dt>
          <dd className="m-0 flex min-w-0 items-center break-words px-4 py-3 text-small text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  </Surface>
);

export default DetailsTable;
