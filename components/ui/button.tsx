import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function Button(props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      style={{
        border: "none",
        borderRadius: 999,
        padding: "12px 18px",
        background: "#b3522b",
        color: "#fffaf2",
        cursor: "pointer",
        fontWeight: 700
      }}
    />
  );
}
