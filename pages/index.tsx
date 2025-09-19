/**
 * Homepage - Personal Introduction and Navigation
 */

import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { HomePageProps } from '@/lib/component-interfaces';
import { siteConfig } from '@/lib/config';

const HomePage: React.FC<HomePageProps> = ({ siteConfig: config }) => {
  return (
    <Layout 
      title="Home"
      description={config.description}
      showNavigation={false}  // Hide navigation for minimal design
    >
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Simple text-based content */}
        <h1 className="text-3xl font-bold mb-4">
          {config.author}
        </h1>
        
        <p className="text-lg mb-8">
          Software engineer specializing in full-stack development, 
          modern web technologies, and scalable applications.
        </p>

        <p className="mb-8">
          I build performant, accessible web applications with a focus on user experience 
          and clean, maintainable code. My expertise includes JavaScript/TypeScript, React, 
          Next.js, Node.js, and cloud platforms.
        </p>

        {/* Simple text links */}
        <p className="mb-4">
          <Link href="/resume" className="text-blue-600 hover:underline">
            View Resume
          </Link>
        </p>

        <p className="mb-4">
          <a 
            href={config.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub Profile
          </a>
        </p>

        {/* Contact information */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          
          {config.socialLinks.email && (
            <p className="mb-2">
              Email: <a 
                href={`mailto:${config.socialLinks.email}`}
                className="text-blue-600 hover:underline"
              >
                {config.socialLinks.email}
              </a>
            </p>
          )}

          {config.socialLinks.linkedin && (
            <p className="mb-2">
              LinkedIn: <a
                href={config.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn Profile
              </a>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  return {
    props: {
      siteConfig,
    },
  };
};

export default HomePage;