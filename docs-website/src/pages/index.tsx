import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Read the docs
          </Link>
          <Link
            className="button button--outline button--lg"
            style={{marginLeft: '0.75rem'}}
            to="/docs/agents/overview">
            Agent skills
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Docs for Firebase Email Link Host and App Universal Links Helper">
      <HomepageHeader />
      <main>
        <section className="container margin-vert--lg">
          <div className="row">
            <div className="col col--4">
              <h3>Email Link Host</h3>
              <p>
                Static / Go / Docker host for Firebase email links and{' '}
                <code>.well-known</code> association files.
              </p>
              <Link to="/docs/email-link-host/overview">Overview →</Link>
            </div>
            <div className="col col--4">
              <h3>Universal Links Helper</h3>
              <p>
                Generate assetlinks, AASA, and Manifest snippets in the browser.
              </p>
              <Link to="/docs/universal-links-helper/overview">Helper docs →</Link>
            </div>
            <div className="col col--4">
              <h3>Agents</h3>
              <p>
                Skills to install cloud CLIs and deploy the Docker image over SSH
                or serverless platforms.
              </p>
              <Link to="/docs/agents/overview">Agent guide →</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
