import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

type Props = {
  onPressInvader: () => void;
  invaderPressed: boolean;
};

type BizCardQueryData = {
  contentfulTextForIndexPage: {
    businessCardContent: {
      raw: string;
    };
  };
};

export default function Bizcard({ onPressInvader, invaderPressed }: Props) {
  const data = useStaticQuery<BizCardQueryData>(graphql`
    query BizCardQuery {
      contentfulTextForIndexPage {
        businessCardContent {
          raw
        }
      }
    }
  `);

  return (
    <div
      className={`bizcard animated ${invaderPressed ? 'hinge' : 'flipInX'}`}
    >
      <div className="name">Ian Sibner</div>
      <div className="blurb">
        {documentToReactComponents(
          JSON.parse(data.contentfulTextForIndexPage.businessCardContent.raw),
        )}
      </div>
      <div className="links">
        <ul>
          <li>
            <a href="mailto:sibnerian@gmail.com">Email</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/sibnerian">LinkedIn</a>
          </li>
          <li>
            <a href="http://github.com/sibnerian">Github</a>
          </li>
          <li className="invader" onClick={onPressInvader}>
            <a href="#"> </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
