// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryDocument } from "../../components/documents/summary-document";
import { sampleQuotationView } from "../../src/lib/sample-project";

describe("SummaryDocument", () => {
  it("renders the project title and total with tax", () => {
    render(React.createElement(SummaryDocument, { view: sampleQuotationView }));

    expect(screen.getByText("新能源汽车电池包温控测试台")).toBeInTheDocument();
    expect(screen.getByText(/含税总价/)).toBeInTheDocument();
  });
});
