import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Email Link Host",
  tagline:
    "Branded HTTPS host for Firebase Auth email links, App Links & Universal Links",
  favicon: "img/favicon.svg",

  future: {
    v4: true,
  },

  url: "https://rutvik24.github.io",
  baseUrl: "/email-link-host/",

  organizationName: "rutvik24",
  projectName: "email-link-host",
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
            "https://github.com/rutvik24/email-link-host/tree/main/docs-website/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/logo.svg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Email Link Host",
      logo: {
        alt: "Email Link Host",
        src: "img/logo.svg",
        href: "/",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
        {
          to: "/docs/hosting/overview",
          label: "Hosting",
          position: "left",
        },
        {
          to: "/docs/hosting/docker",
          label: "Docker",
          position: "left",
        },
        {
          href: "https://rutvik24.github.io/app-universal-links-helper/",
          label: "Links Helper",
          position: "right",
        },
        {
          href: "https://github.com/rutvik24/email-link-host",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      logo: {
        alt: "Email Link Host",
        src: "img/logo.svg",
        href: "/",
        width: 48,
        height: 48,
      },
      links: [
        {
          title: "Docs",
          items: [
            { label: "Introduction", to: "/docs/intro" },
            { label: "Configuration", to: "/docs/email-link-host/configuration" },
            { label: "Docker hosting", to: "/docs/hosting/docker" },
            { label: "Agent skills", to: "/docs/agents/overview" },
          ],
        },
        {
          title: "Related",
          items: [
            {
              label: "Links Helper (live)",
              href: "https://rutvik24.github.io/app-universal-links-helper/",
            },
            {
              label: "Links Helper (GitHub)",
              href: "https://github.com/rutvik24/app-universal-links-helper",
            },
            {
              label: "Docker Hub image",
              href: "https://hub.docker.com/r/rutviknabhoya/email-link-host",
            },
            {
              label: "Releases",
              href: "https://github.com/rutvik24/email-link-host/releases",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/rutvik24/email-link-host",
            },
            {
              label: "Docs site",
              href: "https://rutvik24.github.io/email-link-host/",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} rutvik24 · Email Link Host`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "docker", "yaml", "go"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
