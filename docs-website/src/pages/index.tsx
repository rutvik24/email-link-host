import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HeroShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/>
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2"/>
      <line x1="6" x2="6.01" y1="6" y2="6"/>
      <line x1="6" x2="6.01" y1="18" y2="18"/>
    </svg>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const logo = useBaseUrl("/img/logo.svg");

  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroInner}>
        <div className={styles.heroBadge}>
          <HeroShieldIcon /> Branded Auth Links & Manifest Infrastructure
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.heroLogo}
          src={logo}
          alt="Email Link Host"
          width={96}
          height={96}
        />
        <Heading as="h1" className={styles.heroBrand}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Read the docs →
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://fir-email-link-host.web.app"
          >
            Live Firebase demo
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/hosting/docker"
          >
            Docker guide
          </Link>
          <Link
            className="button button--outline button--lg"
            href="https://github.com/rutvik24/email-link-host"
          >
            GitHub
          </Link>
        </div>

        {/* Quick Launch Terminal Box */}
        <div className={styles.terminalBox}>
          <div className={styles.terminalHeader}>
            <div className={styles.dots}>
              <span className={clsx(styles.dot, styles.dotRed)} />
              <span className={clsx(styles.dot, styles.dotYellow)} />
              <span className={clsx(styles.dot, styles.dotGreen)} />
            </div>
            <span className={styles.terminalTitle}>Instant Launch — Docker One-Liner</span>
            <div />
          </div>
          <div className={styles.terminalBody}>
            <code>docker run -d -p 8080:8080 rutviknabhoya/email-link-host:latest</code>
          </div>
        </div>
      </div>
    </header>
  );
}

const cards = [
  {
    icon: <ServerIcon />,
    title: "Email Link Host",
    body: (
      <>
        High-performance static, Go, and Docker host for Firebase email magic links and{" "}
        <code>.well-known</code> verification manifests.
      </>
    ),
    to: "/docs/email-link-host/overview",
    cta: "Explore Overview →",
  },
  {
    icon: <CodeIcon />,
    title: "Universal Links Helper",
    body: (
      <>
        Browser tool to generate, validate, and preview <code>assetlinks.json</code>, AASA, and AndroidManifest intent filters.
      </>
    ),
    href: "https://rutvik24.github.io/app-universal-links-helper/",
    cta: "Open Live Tool →",
  },
  {
    icon: <SparklesIcon />,
    title: "Autonomous Agent Skills",
    body: (
      <>
        Ready-to-use skills for AI coding agents to provision cloud CLI tools and deploy containers over SSH or serverless infra.
      </>
    ),
    to: "/docs/agents/overview",
    cta: "Agent Guide →",
  },
] as const;

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentation for Email Link Host and App Universal Links Helper"
    >
      <HomepageHeader />
      <main>
        <section className={styles.sections}>
          <h2 className={styles.sectionTitle}>Core Capabilities</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need for branded email authentication and seamless deep links.
          </p>

          <div className={styles.cardGrid}>
            {cards.map((card) => (
              <div key={card.title} className={styles.card}>
                <div className={styles.cardIcon}>{card.icon}</div>
                <Heading as="h3" className={styles.cardTitle}>
                  {card.title}
                </Heading>
                <p>{card.body}</p>
                {"href" in card ? (
                  <Link className={styles.cardLink} href={card.href}>
                    {card.cta}
                  </Link>
                ) : (
                  <Link className={styles.cardLink} to={card.to}>
                    {card.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
