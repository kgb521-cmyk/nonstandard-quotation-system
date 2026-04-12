import * as React from "react";

import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        borderRadius: 14,
        border: "1px solid var(--line)",
        padding: "12px 14px",
        background: "#fffdf9"
      }}
    />
  );
}
