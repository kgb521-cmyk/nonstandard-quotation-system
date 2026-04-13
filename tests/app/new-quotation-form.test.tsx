// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NewQuotationForm } from "../../components/quotation/new-quotation-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  })
}));

describe("NewQuotationForm", () => {
  it("renders the core creation fields instead of redirecting away", () => {
    render(React.createElement(NewQuotationForm));

    expect(screen.getByText("新建报价项目")).toBeInTheDocument();
    expect(screen.getByLabelText("客户名称")).toBeInTheDocument();
    expect(screen.getByLabelText("项目名称")).toBeInTheDocument();
    expect(screen.getByLabelText("设备类型")).toBeInTheDocument();
    expect(screen.getByLabelText("应用场景")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "创建并进入项目" })).toBeInTheDocument();
  });
});
