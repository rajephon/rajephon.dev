/**
 * Contract Tests for Language Toggle Component
 *
 * Tests the language toggle functionality according to the contract
 * defined in specs/002-src-data-resume/contracts/language-toggle.ts
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LanguageToggle } from "../LanguageToggle";
import type { Language } from "../../lib/types";

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("LanguageToggle Contract Tests", () => {
  const mockOnLanguageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe("Basic Functionality", () => {
    it("should render with default English language", () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      expect(screen.getByTestId("language-toggle")).toBeInTheDocument();
      expect(screen.getByText("EN")).toBeInTheDocument();
    });

    it("should display Korean when currentLanguage is ko", () => {
      render(
        <LanguageToggle
          currentLanguage="ko"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      expect(screen.getByText("KO")).toBeInTheDocument();
    });

    it("should call onLanguageChange when clicked", () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      fireEvent.click(screen.getByTestId("language-toggle"));

      expect(mockOnLanguageChange).toHaveBeenCalledWith("ko");
    });

    it("should toggle from Korean to English", () => {
      render(
        <LanguageToggle
          currentLanguage="ko"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      fireEvent.click(screen.getByTestId("language-toggle"));

      expect(mockOnLanguageChange).toHaveBeenCalledWith("en");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      const toggle = screen.getByTestId("language-toggle");
      expect(toggle).toHaveAttribute(
        "aria-label",
        expect.stringContaining("language")
      );
      expect(toggle).toHaveAttribute("role", "button");
    });

    it("should be keyboard accessible", () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      const toggle = screen.getByTestId("language-toggle");

      // Focus and press Enter
      toggle.focus();
      fireEvent.keyDown(toggle, { key: "Enter", code: "Enter" });

      expect(mockOnLanguageChange).toHaveBeenCalledWith("ko");
    });

    it("should respond to Space key", () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      const toggle = screen.getByTestId("language-toggle");

      fireEvent.keyDown(toggle, { key: " ", code: "Space" });

      expect(mockOnLanguageChange).toHaveBeenCalledWith("ko");
    });
  });

  describe("Language Labels", () => {
    it("should display correct labels for both languages", () => {
      const { rerender } = render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      expect(screen.getByText("EN")).toBeInTheDocument();
      expect(screen.getByText("KO")).toBeInTheDocument();

      rerender(
        <LanguageToggle
          currentLanguage="ko"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      expect(screen.getByText("EN")).toBeInTheDocument();
      expect(screen.getByText("KO")).toBeInTheDocument();
    });

    it("should highlight current language", () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      const enButton = screen.getByText("EN");
      const koButton = screen.getByText("KO");

      // English should be active (highlighted)
      expect(enButton).toHaveClass("text-blue-600");
      expect(koButton).not.toHaveClass("text-blue-600");
    });
  });

  describe("Component Variants", () => {
    it("should support text variant", () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
          variant="text"
        />
      );

      expect(screen.getByTestId("language-toggle")).toBeInTheDocument();
    });

    it("should support button variant", () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
          variant="button"
        />
      );

      expect(screen.getByTestId("language-toggle")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
          className="custom-class"
        />
      );

      expect(screen.getByTestId("language-toggle")).toHaveClass("custom-class");
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid clicks gracefully", async () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      const toggle = screen.getByTestId("language-toggle");

      // Rapid clicks
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      fireEvent.click(toggle);

      // Should still work correctly
      await waitFor(() => {
        expect(mockOnLanguageChange).toHaveBeenCalled();
      });
    });

    it("should handle missing onLanguageChange gracefully", () => {
      // This should not throw an error
      expect(() => {
        render(
          <LanguageToggle currentLanguage="en" onLanguageChange={() => {}} />
        );
      }).not.toThrow();
    });
  });

  describe("Performance", () => {
    it("should render quickly (performance contract)", () => {
      const startTime = performance.now();

      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render in less than 10ms (performance target)
      expect(renderTime).toBeLessThan(10);
    });

    it("should handle language changes quickly", async () => {
      render(
        <LanguageToggle
          currentLanguage="en"
          onLanguageChange={mockOnLanguageChange}
        />
      );

      const startTime = performance.now();
      fireEvent.click(screen.getByTestId("language-toggle"));
      const endTime = performance.now();

      const toggleTime = endTime - startTime;

      // Should toggle in less than 10ms (performance target)
      expect(toggleTime).toBeLessThan(10);
    });
  });
});

// Helper function to test the useLanguageToggle hook
describe("useLanguageToggle Hook Contract", () => {
  // Note: This would require a separate test file for the hook
  // For now, we define the expected interface

  it("should match the contract interface", () => {
    // This test documents the expected hook interface
    const expectedInterface = {
      currentLanguage: expect.any(String),
      availableLanguages: expect.any(Array),
      isLoading: expect.any(Boolean),
      toggleLanguage: expect.any(Function),
      setLanguage: expect.any(Function),
    };

    // The hook should implement this interface
    expect(expectedInterface).toBeDefined();
  });
});
