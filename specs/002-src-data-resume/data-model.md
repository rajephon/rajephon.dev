# Data Model: Korean Resume Translation Feature

## Core Entities

### 1. ResumeContent
Represents the complete resume data in a specific language.

**Properties**:
- `language`: 'en' | 'ko' - Language identifier
- `frontmatter`: ResumeFrontmatter - Metadata and header information
- `htmlContent`: string - Parsed HTML from markdown
- `markdownContent`: string - Original markdown source
- `lastUpdated`: Date - Last modification timestamp

**Relationships**:
- Has one ResumeFrontmatter
- May have associated PDFDocument

### 2. ResumeFrontmatter
Metadata extracted from resume markdown frontmatter.

**Properties**:
- `name`: string - Person's name
- `title`: string - Professional title
- `email`: string - Contact email
- `phone`: string (optional) - Contact phone
- `website`: string - Personal website URL
- `location`: string - Geographic location
- `linkedin`: string - LinkedIn profile URL
- `github`: string - GitHub profile URL
- `summary`: string - Professional summary
- `lastUpdated`: string - ISO date string

**Validation**:
- Email must be valid format
- URLs must be valid HTTP/HTTPS
- Required fields: name, title, email

### 3. LanguagePreference
User's selected language for viewing the resume.

**Properties**:
- `selected`: 'en' | 'ko' - Currently selected language
- `available`: Array<'en' | 'ko'> - Available language options

**State Transitions**:
- Initial state: 'en' (default)
- Toggle: 'en' ↔ 'ko'
- Persistence: Save to localStorage on change

### 4. PDFDocument
Generated PDF file for a specific language version.

**Properties**:
- `language`: 'en' | 'ko' - Language of the PDF
- `url`: string - Path to the static PDF file
- `filename`: string - Suggested download filename
- `generatedAt`: Date - Generation timestamp

**Examples**:
```typescript
{
  language: 'en',
  url: '/resume.pdf',
  filename: 'Chanwoo_Noh_Resume.pdf',
  generatedAt: new Date('2025-09-18')
}

{
  language: 'ko',
  url: '/resume-ko.pdf',
  filename: '노찬우_이력서.pdf',
  generatedAt: new Date('2025-09-18')
}
```

### 5. LanguageToggleState
UI state for the language toggle component.

**Properties**:
- `currentLanguage`: 'en' | 'ko' - Active language
- `isLoading`: boolean - Loading state during switch
- `labels`: { en: string, ko: string } - Display labels

**Methods**:
- `toggle()`: Switch between languages
- `setLanguage(lang)`: Set specific language
- `persist()`: Save to localStorage
- `restore()`: Load from localStorage

## Component Props Interfaces

### ResumePageProps (Extended)
```typescript
interface ResumePageProps {
  resumeData: {
    en: ResumeData;
    ko: ResumeData;
  };
  initialLanguage?: 'en' | 'ko';
  showPDFButton?: boolean;
  pdfUrls?: {
    en: string;
    ko: string;
  };
}
```

### ResumeRendererProps (Extended)
```typescript
interface ResumeRendererProps {
  frontmatter: ResumeFrontmatter;
  htmlContent: string;
  language: 'en' | 'ko';
  theme?: string;
  className?: string;
  pdfUrl?: string;
}
```

### LanguageToggleProps
```typescript
interface LanguageToggleProps {
  currentLanguage: 'en' | 'ko';
  onToggle: (language: 'en' | 'ko') => void;
  className?: string;
}
```

## File Structure

```
src/data/
├── resume.md        # English resume content
└── resume-ko.md     # Korean resume content

public/
├── resume.pdf       # English PDF
└── resume-ko.pdf    # Korean PDF
```

## State Management Flow

```
1. Page Load
   ├── Check localStorage for saved preference
   ├── Default to 'en' if not found
   └── Load both language contents

2. Language Toggle
   ├── Update component state
   ├── Switch displayed content
   ├── Update PDF download link
   └── Save preference to localStorage

3. PDF Download
   ├── Determine current language
   ├── Provide corresponding PDF URL
   └── Trigger download with appropriate filename
```

## Validation Rules

### Content Validation
- Both language versions must have all required sections
- Frontmatter fields must match schema
- Markdown must parse without errors
- HTML output must be sanitized

### Language Toggle Validation
- Only valid languages ('en', 'ko') accepted
- Graceful fallback if content missing
- Maintain UI state during errors

### PDF Validation
- Both PDF files must exist at build time
- Proper MIME type for download
- Accessible file permissions

## Data Flow Architecture

```
Build Time:
1. Read resume.md and resume-ko.md
2. Parse markdown to extract frontmatter and content
3. Validate against schema
4. Generate HTML from markdown
5. Create static props with both languages
6. Generate PDFs via Puppeteer

Runtime:
1. Load page with both language contents
2. Initialize with default/saved language
3. Render selected language content
4. Handle language toggle events
5. Update PDF link dynamically
6. Persist preference to localStorage
```

## Migration Notes

### From Current Single-Language System
1. Existing `resume.md` remains unchanged (English version)
2. Add `resume-ko.md` with Korean translation
3. Modify build process to handle both files
4. Update components to support language switching
5. Backward compatible - English remains default

### Future Extensibility
- Structure supports adding more languages
- Language codes follow ISO 639-1 standard
- PDF naming convention: `resume-{lang}.pdf`
- Frontmatter structure identical across languages