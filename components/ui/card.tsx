import * as React from "react";

import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <section
      style={{
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 24,
        padding: 24,
        boxShadow: "0 18px 40px rgba(93, 71, 48, 0.08)"
      }}
    >
      {children}
    </section>
  );
}
