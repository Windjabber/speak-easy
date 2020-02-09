import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import {SpeakEasy, SEO, Door} from "../components";
import '../styles/start.css';


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
            const { title, path } = item.frontmatter;
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
                <Door title={title} path={path} />
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
