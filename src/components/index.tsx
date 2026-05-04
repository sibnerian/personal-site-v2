import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql, useStaticQuery } from 'gatsby';

import './animate.css';
import './index.scss';

type Props = {
  children: React.ReactNode;
};

type SiteTitleQueryData = {
  site: {
    siteMetadata: {
      title: string;
    };
  };
};

const Layout = ({ children }: Props) => {
  const data = useStaticQuery<SiteTitleQueryData>(graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `);

  return (
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
  );
};

export default Layout;
