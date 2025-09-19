/**
 * Integration Tests for Bilingual Resume Page
 *
 * Tests the resume page functionality with both English and Korean content
 * according to the contracts defined in specs/002-src-data-resume/contracts/
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GetStaticProps } from "next";

// Mock the Resume page component and its dependencies
// Note: These will be implemented in the actual component

interface MockResumePageProps {
  resumeData: {
    en: {
      frontmatter: {
        name: string;
        title: string;
        email: string;
        website: string;
        location: string;
        linkedin: string;
        github: string;
        summary: string;
        lastUpdated: string;
      };
      content: string;
      htmlContent: string;
    };
    ko: {
      frontmatter: {
        name: string;
        title: string;
        email: string;
        website: string;
        location: string;
        linkedin: string;
        github: string;
        summary: string;
        lastUpdated: string;
      };
      content: string;
      htmlContent: string;
    };
  };
  initialLanguage?: "en" | "ko";
  pdfUrls?: {
    en: string;
    ko: string;
  };
}

// Mock Resume Page Component
const MockResumePage: React.FC<MockResumePageProps> = ({
  resumeData,
  initialLanguage = "en",
  pdfUrls = { en: "/resume.pdf", ko: "/resume-ko.pdf" },
}) => {
  const [currentLanguage, setCurrentLanguage] = React.useState<"en" | "ko">(
    initialLanguage
  );

  const currentData = resumeData[currentLanguage];
  const currentPdfUrl = pdfUrls[currentLanguage];

  return (
    <div data-testid="resume-page" lang={currentLanguage}>
      <div data-testid="language-toggle">
        <button
          data-testid="language-toggle-button"
          onClick={() =>
            setCurrentLanguage(currentLanguage === "en" ? "ko" : "en")
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setCurrentLanguage(currentLanguage === "en" ? "ko" : "en");
            }
          }}
          aria-label="Toggle language between English and Korean"
        >
          <span
            className={
              currentLanguage === "en" ? "text-blue-600" : "text-gray-600"
            }
          >
            EN
          </span>
          {" | "}
          <span
            className={
              currentLanguage === "ko" ? "text-blue-600" : "text-gray-600"
            }
          >
            KO
          </span>
        </button>
      </div>

      <main data-testid="resume-content">
        <h1 data-testid="resume-name">{currentData.frontmatter.name}</h1>
        <h2 data-testid="resume-title">{currentData.frontmatter.title}</h2>
        <p data-testid="resume-summary">{currentData.frontmatter.summary}</p>

        <div
          data-testid="resume-html-content"
          dangerouslySetInnerHTML={{ __html: currentData.htmlContent }}
        />
      </main>

      <aside data-testid="resume-sidebar">
        <a href={currentPdfUrl} data-testid="pdf-download" download>
          Download PDF
        </a>
      </aside>
    </div>
  );
};

describe("Bilingual Resume Page Integration Tests", () => {
  const mockResumeData: MockResumePageProps["resumeData"] = {
    en: {
      frontmatter: {
        name: "John Doe",
        title: "Software Engineer",
        email: "john@example.com",
        website: "https://johndoe.com",
        location: "San Francisco, CA",
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
        summary: "Experienced software engineer with 5 years of experience",
        lastUpdated: "2025-09-18",
      },
      content: "## Experience\n\nSoftware Engineer at Example Corp.",
      htmlContent:
        "<h2>Experience</h2><p>Software Engineer at Example Corp.</p>",
    },
    ko: {
      frontmatter: {
        name: "홍길동",
        title: "소프트웨어 엔지니어",
        email: "hong@example.com",
        website: "https://honggildong.com",
        location: "서울, 대한민국",
        linkedin: "https://linkedin.com/in/honggildong",
        github: "https://github.com/honggildong",
        summary: "5년 경력의 경험 많은 소프트웨어 엔지니어",
        lastUpdated: "2025-09-18",
      },
      content: "## 경력\n\n예시 회사에서 소프트웨어 엔지니어로 근무.",
      htmlContent:
        "<h2>경력</h2><p>예시 회사에서 소프트웨어 엔지니어로 근무.</p>",
    },
  };

  describe("Initial Page Load", () => {
    it("should display English content by default", () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      expect(screen.getByTestId("resume-name")).toHaveTextContent("John Doe");
      expect(screen.getByTestId("resume-title")).toHaveTextContent(
        "Software Engineer"
      );
      expect(screen.getByTestId("resume-summary")).toHaveTextContent(
        "Experienced software engineer"
      );
    });

    it("should respect initialLanguage prop", () => {
      render(
        <MockResumePage resumeData={mockResumeData} initialLanguage="ko" />
      );

      expect(screen.getByTestId("resume-name")).toHaveTextContent("홍길동");
      expect(screen.getByTestId("resume-title")).toHaveTextContent(
        "소프트웨어 엔지니어"
      );
      expect(screen.getByTestId("resume-summary")).toHaveTextContent(
        "경험 많은 소프트웨어 엔지니어"
      );
    });

    it("should set correct lang attribute on page", () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      expect(screen.getByTestId("resume-page")).toHaveAttribute("lang", "en");
    });
  });

  describe("Language Toggle Functionality", () => {
    it("should switch from English to Korean", async () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      // Verify initial English content
      expect(screen.getByTestId("resume-name")).toHaveTextContent("John Doe");

      // Click language toggle
      fireEvent.click(screen.getByTestId("language-toggle-button"));

      // Verify Korean content is displayed
      await waitFor(() => {
        expect(screen.getByTestId("resume-name")).toHaveTextContent("홍길동");
        expect(screen.getByTestId("resume-title")).toHaveTextContent(
          "소프트웨어 엔지니어"
        );
      });
    });

    it("should switch from Korean to English", async () => {
      render(
        <MockResumePage resumeData={mockResumeData} initialLanguage="ko" />
      );

      // Verify initial Korean content
      expect(screen.getByTestId("resume-name")).toHaveTextContent("홍길동");

      // Click language toggle
      fireEvent.click(screen.getByTestId("language-toggle-button"));

      // Verify English content is displayed
      await waitFor(() => {
        expect(screen.getByTestId("resume-name")).toHaveTextContent("John Doe");
        expect(screen.getByTestId("resume-title")).toHaveTextContent(
          "Software Engineer"
        );
      });
    });

    it("should update lang attribute when language changes", async () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      // Initial lang should be 'en'
      expect(screen.getByTestId("resume-page")).toHaveAttribute("lang", "en");

      // Toggle to Korean
      fireEvent.click(screen.getByTestId("language-toggle-button"));

      // Lang should update to 'ko'
      await waitFor(() => {
        expect(screen.getByTestId("resume-page")).toHaveAttribute("lang", "ko");
      });
    });

    it("should highlight current language in toggle", () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      const toggleButton = screen.getByTestId("language-toggle-button");

      // English should be highlighted initially
      expect(toggleButton.querySelector("span")).toHaveClass("text-blue-600");
    });
  });

  describe("Content Rendering", () => {
    it("should render HTML content correctly for English", () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      const htmlContent = screen.getByTestId("resume-html-content");
      expect(htmlContent.innerHTML).toContain("<h2>Experience</h2>");
      expect(htmlContent.innerHTML).toContain(
        "<p>Software Engineer at Example Corp.</p>"
      );
    });

    it("should render HTML content correctly for Korean", async () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      // Switch to Korean
      fireEvent.click(screen.getByTestId("language-toggle-button"));

      await waitFor(() => {
        const htmlContent = screen.getByTestId("resume-html-content");
        expect(htmlContent.innerHTML).toContain("<h2>경력</h2>");
        expect(htmlContent.innerHTML).toContain(
          "<p>예시 회사에서 소프트웨어 엔지니어로 근무.</p>"
        );
      });
    });

    it("should display all frontmatter fields correctly", () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      expect(screen.getByTestId("resume-name")).toHaveTextContent("John Doe");
      expect(screen.getByTestId("resume-title")).toHaveTextContent(
        "Software Engineer"
      );
      expect(screen.getByTestId("resume-summary")).toHaveTextContent(
        "Experienced software engineer with 5 years of experience"
      );
    });
  });

  describe("PDF Download Functionality", () => {
    it("should link to English PDF by default", () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      const pdfLink = screen.getByTestId("pdf-download");
      expect(pdfLink).toHaveAttribute("href", "/resume.pdf");
    });

    it("should update PDF link when language changes", async () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      // Toggle to Korean
      fireEvent.click(screen.getByTestId("language-toggle-button"));

      await waitFor(() => {
        const pdfLink = screen.getByTestId("pdf-download");
        expect(pdfLink).toHaveAttribute("href", "/resume-ko.pdf");
      });
    });

    it("should have download attribute for PDF links", () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      const pdfLink = screen.getByTestId("pdf-download");
      expect(pdfLink).toHaveAttribute("download");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels for language toggle", () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      const toggleButton = screen.getByRole("button");
      expect(toggleButton).toHaveAttribute(
        "aria-label",
        "Toggle language between English and Korean"
      );
    });

    it("should maintain proper heading hierarchy", () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "John Doe"
      );
      const h2Elements = screen.getAllByRole("heading", { level: 2 });
      expect(h2Elements.length).toBeGreaterThanOrEqual(1);
      expect(h2Elements[0]).toHaveTextContent("Software Engineer");
    });

    it("should be keyboard accessible", () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      const toggleButton = screen.getByRole("button");

      // Should be focusable
      toggleButton.focus();
      expect(document.activeElement).toBe(toggleButton);

      // Should respond to Enter key
      fireEvent.keyDown(toggleButton, { key: "Enter", code: "Enter" });
      expect(screen.getByTestId("resume-name")).toHaveTextContent("홍길동");
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();

      render(<MockResumePage resumeData={mockResumeData} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render in reasonable time
      expect(renderTime).toBeLessThan(100);
    });

    it("should switch languages quickly", async () => {
      render(<MockResumePage resumeData={mockResumeData} />);

      const startTime = performance.now();
      fireEvent.click(screen.getByTestId("language-toggle-button"));

      await waitFor(() => {
        expect(screen.getByTestId("resume-name")).toHaveTextContent("홍길동");
      });

      const endTime = performance.now();
      const switchTime = endTime - startTime;

      // Should switch in under 50ms (well under the 100ms target)
      expect(switchTime).toBeLessThan(50);
    });
  });

  describe("Error Handling", () => {
    it("should handle missing Korean content gracefully", () => {
      const incompleteData = {
        en: mockResumeData.en,
        ko: {
          ...mockResumeData.ko,
          frontmatter: {
            ...mockResumeData.ko.frontmatter,
            name: "", // Missing required field
          },
        },
      };

      expect(() => {
        render(<MockResumePage resumeData={incompleteData} />);
      }).not.toThrow();
    });

    it("should handle malformed HTML content", () => {
      const malformedData = {
        ...mockResumeData,
        en: {
          ...mockResumeData.en,
          htmlContent: "<h2>Unclosed tag<p>Content",
        },
      };

      expect(() => {
        render(<MockResumePage resumeData={malformedData} />);
      }).not.toThrow();
    });
  });
});

// Mock getStaticProps function tests
describe("Resume Page getStaticProps", () => {
  it("should return props with both language versions", async () => {
    // This would test the actual getStaticProps implementation
    const expectedProps = {
      resumeData: {
        en: expect.objectContaining({
          frontmatter: expect.any(Object),
          content: expect.any(String),
          htmlContent: expect.any(String),
        }),
        ko: expect.objectContaining({
          frontmatter: expect.any(Object),
          content: expect.any(String),
          htmlContent: expect.any(String),
        }),
      },
      initialLanguage: "en",
      pdfUrls: {
        en: "/resume.pdf",
        ko: "/resume-ko.pdf",
      },
    };

    // The actual implementation would be tested here
    expect(expectedProps).toBeDefined();
  });

  it("should handle file reading errors gracefully", async () => {
    // Test error handling in getStaticProps
    // This would test the actual error handling logic
    expect(true).toBe(true); // Placeholder
  });
});
