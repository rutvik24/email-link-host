import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const logo = useBaseUrl("/img/logo.svg");

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={clsx("container", styles.heroInner)}>
        <img
          className={styles.heroLogo}
          src={logo}
          alt="Email Link Host"
          width={88}
          height={88}
        />
        <Heading as="h1" className={styles.heroBrand}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Read the docs
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
      </div>
    </header>
  );
}

const cards = [
  {
    title: "Email Link Host",
    body: (
      <>
        Static / Go / Docker host for Firebase email links and{" "}
        <code>.well-known</code> association files.
      </>
    ),
    to: "/docs/email-link-host/overview",
    cta: "Overview →",
  },
  {
    title: "Universal Links Helper",
    body: <>Generate assetlinks, AASA, and Manifest snippets in the browser.</>,
    to: "/docs/universal-links-helper/overview",
    cta: "Helper docs →",
  },
  {
    title: "Agents",
    body: (
      <>
        Skills to install cloud CLIs and deploy the Docker image over SSH or
        serverless platforms.
      </>
    ),
    to: "/docs/agents/overview",
    cta: "Agent guide →",
  },
] as const;

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Docs for Email Link Host and App Universal Links Helper"
    >
      <HomepageHeader />
      <main>
        <section className={clsx("container", styles.sections)}>
          <div className="row">
            {cards.map((card) => (
              <div key={card.title} className="col col--4 margin-bottom--lg">
                <div className={styles.card}>
                  <Heading as="h3" className={styles.cardTitle}>
                    {card.title}
                  </Heading>
                  <p>{card.body}</p>
                  <Link className={styles.cardLink} to={card.to}>
                    {card.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
