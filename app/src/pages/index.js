import React, {Component} from "react";
import {graphql} from "gatsby";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMicrophone} from "@fortawesome/free-solid-svg-icons"
import Layout from "../components/layout";
import SpeechRecognition from 'react-speech-recognition'
import SEO from "../components/seo";
import '../styles/start.css';


class Start extends Component {

    render() {

        return (
            <>
                <Layout>
                    <SEO title="Home"/>
                    <div style={{justifyContent: 'center', textAlign: 'center', alignItems: 'center'}}>
                        <h1 style={{fontSize: "60pt"}}>
                            Let's Riff!
                        </h1>
                        <button
                            style={{border: 'none', marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white'}}
                            onClick={() => {
                                console.log("Starting");

                                fetch('http://localhost:8080/start', {
                                    method: 'POST',
                                });

                            }}
                        >
                            <FontAwesomeIcon icon={faMicrophone} size={"8x"} color="white" style={{
                                'borderRadius': '150px',
                                padding: '0.5em 0.65em',
                                backgroundColor: '#0CD6B5'
                            }}
                                             className="start-button"/>
                        </button>
                    </div>
                </Layout>
            </>
        );
    }
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

const options = {
    autoStart: false
};

export default SpeechRecognition(options)(Start);
