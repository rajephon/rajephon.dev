/**
 * ResumeRenderer Component
 *
 * Renders markdown resume content with markdown-resume theme styling,
 * iconify icon support, and print optimization
 */

import React from "react";
import { ResumeRendererProps } from "@/lib/component-interfaces";
import { Language } from "../hooks/useLanguageToggle";

interface ExtendedResumeRendererProps extends ResumeRendererProps {
  language?: Language;
}

const ResumeRenderer: React.FC<ExtendedResumeRendererProps> = ({
  frontmatter,
  htmlContent,
  className = "",
  printOptimized = false,
  theme = "markdown-resume",
  pdfUrl,
  language = "en",
}) => {
  const containerClasses = [
    "resume",
    "resume-container",
    `theme-${theme}`,
    `lang-${language}`,
    language === "ko" && "font-korean",
    printOptimized && "print-optimized",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const formatPhoneForTel = (phone?: string) => {
    if (!phone) return "";
    // Remove all non-digits and prepend country code if missing
    const digits = phone.replace(/\D/g, "");
    return digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
  };

  const renderContactInfo = () => (
    <div className="resume-header" data-testid="contact-section">
      <h1>{frontmatter.name}</h1>

      {/* Contact Information with Iconify Icons */}
      <div className="contact-group">
        <dl>
          <dt>
            <span className="iconify" data-icon="charm:person"></span>
            {frontmatter.website && (
              <a
                href={frontmatter.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {frontmatter.website.replace(/https?:\/\//, "")}
              </a>
            )}
          </dt>
          <dd>
            {frontmatter.github && (
              <>
                <span
                  className="iconify"
                  data-icon="tabler:brand-github"
                ></span>
                <a
                  href={frontmatter.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {frontmatter.github.replace(/https?:\/\/(www\.)?/, "")}
                </a>
              </>
            )}
          </dd>
          <dd>
            {frontmatter.phone && (
              <>
                <span className="iconify" data-icon="tabler:phone"></span>
                <a href={`tel:${formatPhoneForTel(frontmatter.phone)}`}>
                  {frontmatter.phone}
                </a>
              </>
            )}
          </dd>
        </dl>
      </div>

      <div className="contact-group">
        <dl>
          <dt>
            {frontmatter.location && (
              <>
                <span
                  className="iconify"
                  data-icon="ic:outline-location-on"
                ></span>
                {frontmatter.location}
              </>
            )}
          </dt>
          <dd>
            {frontmatter.linkedin && (
              <>
                <span
                  className="iconify"
                  data-icon="tabler:brand-linkedin"
                ></span>
                <a
                  href={frontmatter.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {frontmatter.linkedin.replace(/https?:\/\/(www\.)?/, "")}
                </a>
              </>
            )}
          </dd>
          <dd>
            {frontmatter.email && (
              <>
                <span className="iconify" data-icon="tabler:mail"></span>
                <a href={`mailto:${frontmatter.email}`}>{frontmatter.email}</a>
              </>
            )}
          </dd>
        </dl>
      </div>
    </div>
  );

  const processHtmlContent = (content: string) => {
    // Ensure iconify attributes are preserved
    let processedContent = content
      .replace(/data-icon="([^"]+)"/g, 'data-icon="$1"')
      .replace(/<span class="iconify"/g, '<span className="iconify"');

    // Add proper structure classes for markdown-resume theme
    processedContent = processedContent
      .replace(/<dl>/g, '<dl className="flex">')
      .replace(/<dt>/g, '<dt className="flex-1">')
      .replace(/<dd>/g, '<dd className="flex-1">');

    return processedContent;
  };

  return (
    <div className={containerClasses} data-testid="resume-container">
      {/* Contact Header */}
      {renderContactInfo()}

      {/* Professional Title */}
      {frontmatter.title && (
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            {frontmatter.title}
          </h2>
        </div>
      )}

      {/* Summary */}
      {frontmatter.summary && (
        <div className="resume-section mb-8">
          <h2>Summary</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {frontmatter.summary}
          </p>
        </div>
      )}

      {/* Resume Content */}
      <div
        className="resume-content"
        dangerouslySetInnerHTML={{
          __html: processHtmlContent(htmlContent),
        }}
      />

      {/* Last Updated and PDF Link */}
      {frontmatter.lastUpdated && !printOptimized && (
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 print-hide">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === "ko" ? "최종 업데이트: " : "Last updated: "}
            {new Date(frontmatter.lastUpdated).toLocaleDateString(
              language === "ko" ? "ko-KR" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
          {pdfUrl && (
            <p className="text-sm mt-2">
              <a
                href={pdfUrl}
                download={`${frontmatter.name?.toLowerCase().replace(/\s+/g, "-") || "resume"}-resume.pdf`}
                className="text-blue-600 hover:underline"
                data-testid="pdf-download"
              >
                {language === "ko" ? "PDF 버전" : "PDF version"}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeRenderer;
