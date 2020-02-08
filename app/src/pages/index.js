import React from "react";
import { graphql } from "gatsby";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from "@fortawesome/free-solid-svg-icons"
import Layout from "../components/layout";
import SEO from "../components/seo";

const Start = () => {
  return (
    <>
      <Layout>
        <SEO title="Home" />
        <div style={{justifyContent: 'center', textAlign: 'center', alignItems: 'center'}}>
          <h1 style={{fontSize: "60pt"}}>
            Let's Riff!
          </h1>
          <button
            style={{ border: 'none', marginLeft: 'auto', marginRight: 'auto'}}
            onClick={() => {
              console.log("Hello world!");
            }}
          >
            <FontAwesomeIcon icon={faMicrophone} size={"8x"} color="#0CD6B5" style={{
              'borderRadius': '150px',
              'boxShadow': '0px 0px 2px #888',
              'padding': '0.5em 0.65em',}}/>
          </button>
        </div>
      </Layout>
    </>
  );
};

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
