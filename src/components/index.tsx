import React from 'react';
import { Helmet } from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import './animate.css';
import './index.scss';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={(data) => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        >
          <html lang="en" />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&family=Press+Start+2P&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <div className="content">{children}</div>
      </>
    )}
  />
);

export default Layout;
