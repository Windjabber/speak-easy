import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import {SpeakEasy, SEO, Door} from "../components";
import '../styles/start.css';


const Start = ({ data }) => {
  const { nodes } = data.allMdx;
  var words = ['Rock', 'Paper', 'Scissors'];

  const [chosenWord, setChosenWord] = useState("Rock");

  useEffect(() => {
    setChosenWord(words[Math.floor(Math.random() * words.length)]);
  }, [])

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
                >
                  <Door title={title} path={path} />
                </div>
              );
            })}
            <div
              className="col-xs-12 col-md-6 col-lg-4 pad-10-l pad-10-r"
              onClick={ () => {
                fetch(`http://localhost:8080/start/${chosenWord}`, {
                    method: 'POST',
                });
              }
              }
            >
              <Door title={`Let's Riff on: ${chosenWord}`} path={chosenWord} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const query = graphql`
  {
    allMdx(filter: {frontmatter: {title: {glob: "!(Let's Riff on)*"}, path: {ne: "/BugFixPres"}}}) {
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
