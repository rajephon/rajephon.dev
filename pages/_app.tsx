/**
 * Next.js App Component
 *
 * Global app configuration and providers
 */

import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

// Import global styles
import "@/styles/globals.css";
import "@/styles/resume-base.css";
import "@/styles/themes/markdown-resume.css";
import "@/styles/print.css";

// Import Analytics components
import Analytics from "@/components/Analytics";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />

      {/* Analytics */}
      <Analytics debug={true} />
    </>
  );
}
