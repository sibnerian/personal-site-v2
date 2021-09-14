import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { OutboundLink } from 'gatsby-plugin-google-gtag';

type Props = {
  onPressInvader: () => void;
  invaderPressed: boolean;
};

export default function Bizcard({ onPressInvader, invaderPressed }: Props) {
  return (
    <StaticQuery
      query={graphql`
        query BizCardQuery {
          contentfulTextForIndexPageBusinessCardContentRichTextNode {
            id
            json
            nodeType
          }
        }
      `}
      render={(data) => (
        <div
          className={`bizcard animated ${invaderPressed ? 'hinge' : 'flipInX'}`}
        >
          <div className="name">Ian Sibner</div>
          <div className="blurb">
            {documentToReactComponents(
              data.contentfulTextForIndexPageBusinessCardContentRichTextNode
                .json
            )}
          </div>
          <div className="links">
            <ul>
              <li>
                <OutboundLink href="mailto:sibnerian@gmail.com">
                  Email
                </OutboundLink>
              </li>
              <li>
                <OutboundLink href="https://www.linkedin.com/in/sibnerian">
                  LinkedIn
                </OutboundLink>
              </li>
              <li>
                <OutboundLink href="http://github.com/sibnerian">
                  Github
                </OutboundLink>
              </li>
              <li className="invader" onClick={onPressInvader}>
                <a href="#"> </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    />
  );
}
