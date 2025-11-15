import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoginPage from "../pages/LoginPage";
import { AuthProvider } from "../auth/AuthContext";
import { BrowserRouter } from "react-router-dom";

// Mock API calls via localStorage token usage — simple smoke test
describe("LoginPage", () => {
  it("renders and validates input", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/email/i);
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "bademail" } });
    const btn = screen.getByRole("button", { name: /login/i });
    fireEvent.click(btn);

    // There may be multiple places showing the same validation message (inline + toast).
    // Assert that at least one element contains the message.
    const matches = screen.getAllByText(/enter a valid email/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});
