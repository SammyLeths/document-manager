import { render, screen, fireEvent } from "@testing-library/react";
import DocumentManager from "./DocumentManager";

test("renders the initial folder contents", () => {
  render(<DocumentManager />);
  expect(screen.getByText("Employee Handbook")).toBeInTheDocument();
  expect(screen.getByText("Public Holiday policy")).toBeInTheDocument();
  expect(screen.getByText("Expenses")).toBeInTheDocument();
});

test("navigates into a folder and updates the breadcrumb", () => {
  render(<DocumentManager />);
  fireEvent.click(screen.getByText("Expenses"));
  expect(screen.getByText("Expenses claim form")).toBeInTheDocument();
  expect(screen.getByText("Fuel allowances")).toBeInTheDocument();
  expect(screen.getByText("Documents")).toBeInTheDocument();
  expect(screen.getByText("Expenses")).toBeInTheDocument();
});

test("filters files by name", () => {
  render(<DocumentManager />);
  fireEvent.change(screen.getByPlaceholderText("Filter by filename..."), {
    target: { value: "Employee" },
  });
  expect(screen.getByText("Employee Handbook")).toBeInTheDocument();
  expect(screen.queryByText("Public Holiday policy")).not.toBeInTheDocument();
});

test("sorts files by name in ascending order", () => {
  render(<DocumentManager />);
  fireEvent.click(screen.getByText("Name Ascending"));
  const rows = screen.getAllByRole("row");
  expect(rows[1].textContent).toContain("Cost centres");
});
