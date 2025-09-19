/**
 * Homepage - Personal Introduction and Navigation
 */

import React from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { HomePageProps } from "@/lib/component-interfaces";
import { siteConfig } from "@/lib/config";

const HomePage: React.FC<HomePageProps> = ({ siteConfig: config }) => {
  return (
    <Layout
      title="Home"
      description={config.description}
      showNavigation={false} // Hide navigation for minimal design
    >
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Profile Image */}
        <div className="flex justify-center mb-8">
          <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg">
            <Image
              src="/profile.png"
              alt="Chanwoo Noh"
              fill
              className="object-cover"
              style={{ objectPosition: "50% 50%" }}
              priority
            />
          </div>
        </div>

        {/* Simple text-based content */}
        <h1 className="text-3xl font-bold mb-4 text-center">{config.author}</h1>

        <p className="text-lg mb-8">
          Backend engineer with 8 years of experience designing scalable
          distributed systems, from game servers supporting millions of players
          to AI platforms integrating real-time LLM streaming.
        </p>

        <p className="mb-8">
          Currently working on building the backend systems for
          &quot;Aster,&quot; a global personal AI agent. Previously led server
          development for &quot;Brixity,&quot; which reached #1 on app store
          charts and handled over 12 million requests per hour.
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
              Email:{" "}
              <a
                href={`mailto:${config.socialLinks.email}`}
                className="text-blue-600 hover:underline"
              >
                {config.socialLinks.email}
              </a>
            </p>
          )}

          {config.socialLinks.linkedin && (
            <p className="mb-2">
              LinkedIn:{" "}
              <a
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
