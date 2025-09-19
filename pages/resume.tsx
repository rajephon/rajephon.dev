/**
 * Resume Page - Displays parsed markdown resume with PDF export and language toggle
 */

import React from 'react';
import { GetStaticProps } from 'next';
import path from 'path';
import { readFile } from 'fs/promises';
import Layout from '@/components/Layout';
import ResumeRenderer from '@/components/ResumeRenderer';
import { LanguageToggle } from '@/components/LanguageToggle';
import { parseMultiLanguageResume } from '@/lib/markdown';
import { validateResumeData } from '@/lib/resume-schema';
import { useLanguageToggle } from '@/hooks/useLanguageToggle';

interface MultiLanguageResumePageProps {
  resumeData: {
    en: any;
    ko: any;
  };
  showPDFButton?: boolean;
  pdfUrls?: {
    en: string;
    ko: string;
  };
}

const ResumePage: React.FC<MultiLanguageResumePageProps> = ({ 
  resumeData, 
  showPDFButton = true, 
  pdfUrls = { en: '/resume.pdf', ko: '/resume-ko.pdf' }
}) => {
  const { currentLanguage, setLanguage } = useLanguageToggle('en');
  
  // Get current language data
  const currentResumeData = resumeData[currentLanguage];
  const currentPdfUrl = pdfUrls[currentLanguage];
  const pageTitle = `Resume - ${currentResumeData.frontmatter.name}`;
  const pageDescription = currentResumeData.frontmatter.summary || 
    `${currentResumeData.frontmatter.title} - Professional resume and experience`;

  return (
    <Layout 
      title={pageTitle}
      description={pageDescription}
      showNavigation={false}  // Hide navigation for flat design
    >


        {/* Simple back link and language toggle */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8">
          <div className="flex justify-between items-center print-hide">
            <p>
              <a
                href="/"
                className="text-blue-600 hover:underline"
              >
                ← Back to Home
              </a>
            </p>
            
            <LanguageToggle
              currentLanguage={currentLanguage}
              onLanguageChange={setLanguage}
              variant="text"
              className="ml-4"
            />
          </div>
        </div>


      <div className="max-w-4xl mx-auto px-4 py-8 print:max-w-none print:px-0">
        {/* Resume Content */}
        <div className="max-w-4xl mx-auto">
          <ResumeRenderer
            frontmatter={currentResumeData.frontmatter}
            htmlContent={currentResumeData.htmlContent || ''}
            theme="markdown-resume"
            className="p-0"  // Remove padding for flat appearance
            pdfUrl={showPDFButton ? currentPdfUrl : undefined}
            language={currentLanguage}
          />
        </div>

      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<MultiLanguageResumePageProps> = async () => {
  try {
    // Read both English and Korean resume files
    const englishPath = path.join(process.cwd(), 'src', 'data', 'resume.md');
    const koreanPath = path.join(process.cwd(), 'src', 'data', 'resume-ko.md');
    
    const [englishContent, koreanContent] = await Promise.all([
      readFile(englishPath, 'utf-8'),
      readFile(koreanPath, 'utf-8')
    ]);
    
    // Parse both language versions using the multi-language parser
    const multiLanguageData = await parseMultiLanguageResume({
      en: englishContent,
      ko: koreanContent
    });
    
    // Validate both language versions
    const validatedEnglish = validateResumeData(multiLanguageData.en);
    const validatedKorean = validateResumeData(multiLanguageData.ko);
    
    return {
      props: {
        resumeData: {
          en: validatedEnglish,
          ko: validatedKorean
        },
        showPDFButton: true,
        pdfUrls: {
          en: '/resume.pdf',
          ko: '/resume-ko.pdf'
        },
      },
    };
  } catch (error) {
    console.error('Error loading resume:', error);
    throw error; // Re-throw to show build error
  }
};

export default ResumePage;