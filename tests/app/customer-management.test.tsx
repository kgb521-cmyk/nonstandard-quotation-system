// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CustomerManagement } from "../../components/customers/customer-management";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  })
}));

describe("CustomerManagement", () => {
  it("renders customer creation fields and existing customer list", () => {
    render(
      React.createElement(CustomerManagement, {
        initialCustomers: [
          {
            id: "customer-1",
            company: "华东实验室科技有限公司",
            contactName: "陈敏",
            industry: "新能源",
            region: "上海"
          }
        ]
      })
    );

    expect(screen.getByText("客户管理")).toBeInTheDocument();
    expect(screen.getByLabelText("客户公司")).toBeInTheDocument();
    expect(screen.getByLabelText("联系人")).toBeInTheDocument();
    expect(screen.getByLabelText("联系电话")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "新增客户" })).toBeInTheDocument();
    expect(screen.getByText("华东实验室科技有限公司")).toBeInTheDocument();
  });
});
