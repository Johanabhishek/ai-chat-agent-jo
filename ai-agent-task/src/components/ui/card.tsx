import * as React from "react";

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ""}`} {...props}>
      {children}
    </div>
  );
}
