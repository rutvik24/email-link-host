import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Email Link Host",
  tagline:
    "Free static host for Firebase Auth email links, App Links & Universal Links",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://rutvik24.github.io",
  baseUrl: "/firebase-email-link-host/",

  organizationName: "rutvik24",
  projectName: "firebase-email-link-host",
  trailingSlash: false,

  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/rutvik24/firebase-email-link-host/tree/main/docs-website/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Email Link Host",
      logo: {
        alt: "Email Link Host",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/rutvik24/firebase-email-link-host",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://github.com/rutvik24/app-universal-links-helper",
          label: "Links Helper",
          position: "right",
        },
        {
          href: "https://hub.docker.com/r/rutviknabhoya/firebase-email-link-host",
          label: "Docker Hub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Introduction", to: "/docs/intro" },
            { label: "Docker hosting", to: "/docs/hosting/docker" },
            { label: "Agent skills", to: "/docs/agents/overview" },
          ],
        },
        {
          title: "Related",
          items: [
            {
              label: "App Universal Links Helper",
              href: "https://github.com/rutvik24/app-universal-links-helper",
            },
            {
              label: "Docker image",
              href: "https://hub.docker.com/r/rutviknabhoya/firebase-email-link-host",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/rutvik24/firebase-email-link-host",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} rutvik24. Built with Docusaurus + Bun.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "docker", "yaml", "go"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
