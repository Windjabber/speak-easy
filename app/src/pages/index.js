import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import {SpeakEasy, SEO} from "../components";
import '../styles/start.css';
import AniLink from "gatsby-plugin-transition-link/AniLink";


const Start = ({ data }) => {
  const { nodes } = data.allMdx;
  return (
      <>
      <Layout>
        <SEO title="Home"/>
        <div className="container">
          <div className="row center-xs pad-20-t">
            <div className="col-xs-6">
              <SpeakEasy/>
            </div>
          </div>
          <div className="row">
          {nodes.map(item => {
            const { path } = item.frontmatter;
            return (
              <div
                className="col-xs-12 col-md-6 col-lg-4 pad-10-l pad-10-r"
                onClick={ () => {
                  fetch('http://localhost:8080/start', {
                      method: 'POST',
                  });
                }
                }
              >
                <AniLink
                  cover
                  to={`/decks/${path}/slides/0`}
                  bg="#fff"
                >
                  <div className="door"/>
                </AniLink>
              </div>
            );
          })}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const query = graphql`
  {
    allMdx {
      nodes {
        frontmatter {
          path
          title
          desc
          location
        }
      }
    }
  }
`;

export default Start;
