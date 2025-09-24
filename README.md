# Rajephon.dev - Personal Website & Resume

A modern, responsive personal website built with Next.js, featuring a markdown-to-HTML resume with PDF export functionality. Designed for GitHub Pages deployment with custom domain support.

## ✨ Features

- **Markdown Resume**: Write your resume in markdown with frontmatter metadata
- **Bilingual Support**: Korean/English resume with language toggle
- **PDF Export**: Automatic PDF generation with print-optimized styling
- **Google Analytics**: Privacy-first GA4 integration with GDPR compliance
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark Mode**: Automatic dark/light theme switching
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Iconify Integration**: Beautiful icons throughout the interface
- **GitHub Pages**: Automated deployment with GitHub Actions
- **TypeScript**: Fully typed codebase with strict type checking
- **Testing**: Comprehensive test suite with Jest and Testing Library

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/rajephon/rajephon-dev.git
   cd rajephon-dev
   npm install
   ```

2. **Add Your Resume**
   Edit `src/data/resume.md` with your information:
   ```yaml
   ---
   name: "Your Name"
   title: "Your Title"
   email: "your.email@domain.com"
   # ... other fields
   ---
   
   # Your Name
   
   ## Experience
   # Your experience here...
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

4. **Build and Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

## 📁 Project Structure

```
rajephon-dev/
├── src/
│   ├── components/          # React components
│   │   ├── Layout.tsx
│   │   ├── ResumeRenderer.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── Analytics.tsx
│   │   └── ConsentBanner.tsx
│   ├── pages/              # Next.js pages
│   │   ├── index.tsx       # Homepage
│   │   └── resume.tsx      # Resume page
│   ├── lib/                # Utilities and config
│   │   ├── config.ts
│   │   ├── markdown.ts
│   │   ├── analytics.ts    # GA4 tracking
│   │   ├── consent.ts      # GDPR compliance
│   │   └── resume-schema.ts
│   ├── hooks/              # React hooks
│   │   ├── useAnalytics.ts
│   │   ├── useConsent.ts
│   │   └── useLanguageToggle.ts
│   ├── styles/             # CSS and themes
│   │   ├── globals.css
│   │   ├── resume-base.css
│   │   └── themes/
│   └── data/
│       ├── resume.md       # English resume
│       └── resume-ko.md    # Korean resume
├── scripts/                # Build scripts
├── .github/workflows/      # GitHub Actions
└── public/                 # Static assets
```

## 🎨 Customization

### Resume Content
Edit `src/data/resume.md` following the markdown-resume format:
- Use frontmatter for metadata (name, email, etc.)
- Include iconify icons for visual enhancement
- Follow the structured format for consistent styling

### Styling
- **Base styles**: `src/styles/resume-base.css`
- **Themes**: `src/styles/themes/`
- **Print styles**: `src/styles/print.css`

### Site Configuration
Update `src/lib/config.ts` with your details:
- Site title and description
- Social links
- SEO settings
- Domain configuration
- Analytics settings

### Google Analytics Setup
1. **Get GA4 Measurement ID**:
   - Create a Google Analytics 4 property
   - Copy the Measurement ID (format: G-XXXXXXXXXX)

2. **Local Development**:
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **GitHub Pages Deployment**:
   - Go to Repository Settings → Secrets and variables → Actions
   - Add new secret: `NEXT_PUBLIC_GA_ID` with your GA4 ID
   - Analytics will be automatically enabled on deployment

4. **Privacy & GDPR Compliance**:
   - Consent banner automatically appears for EU users
   - Respects Do Not Track browser settings
   - Users can manage consent preferences
   - Analytics disabled without valid consent

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 📄 PDF Generation

PDF is generated automatically during deployment:

```bash
# Generate PDF locally
npm run generate-pdf

# Validate resume structure
npm run validate-resume
```

## 🚀 Deployment

### GitHub Pages (Automatic)

1. Push to `main` branch
2. GitHub Actions builds and deploys automatically
3. Site available at `https://yourusername.github.io/repository-name`

### Custom Domain

1. Add `CNAME` file with your domain
2. Configure DNS records:
   ```
   Type: A, Name: @, Value: 185.199.108.153
   Type: A, Name: @, Value: 185.199.109.153
   Type: A, Name: @, Value: 185.199.110.153  
   Type: A, Name: @, Value: 185.199.111.153
   ```

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom themes
- **Markdown**: Remark/Unified with GFM and math support
- **Icons**: Iconify with 100,000+ icons
- **PDF**: Puppeteer for server-side generation
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: GitHub Actions → GitHub Pages

## 📱 Performance

- ✅ Core Web Vitals optimized
- ✅ Static generation for fast loading
- ✅ Responsive images and assets
- ✅ Print-optimized PDF generation
- ✅ SEO and accessibility compliant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
6. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Inspired by [markdown-resume](https://github.com/junian/markdown-resume)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Iconify](https://iconify.design/)

---

Built with ❤️ by [Rajephon](https://rajephon.dev)