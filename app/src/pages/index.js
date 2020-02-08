import React, {Component} from "react";
import { graphql } from "gatsby";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from "@fortawesome/free-solid-svg-icons"
import SpeechRecognition from 'react-speech-recognition'
import Layout from "../components/layout";
import SEO from "../components/seo";
import * as PropTypes from "prop-types";


class Start extends Component {

  state = {
    transcript: ""
  };

  render() {
    let {
      transcript,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = this.props;

    if (!browserSupportsSpeechRecognition) {
      return null
    }
    console.log(transcript);
    return (
      <>
        <Layout>
          <SEO title="Home"/>
          <div style={{justifyContent: 'center', textAlign: 'center', alignItems: 'center'}}>
            <h1 style={{fontSize: "60pt"}}>
              Let's Riff!
            </h1>
            <button
              style={{border: 'none', marginLeft: 'auto', marginRight: 'auto'}}
              onClick={() => {
                resetTranscript();
              }}
            >
              <FontAwesomeIcon icon={faMicrophone} size={"8x"} color="#0CD6B5" style={{
                'borderRadius': '150px',
                'boxShadow': '0px 0px 2px #888',
                'padding': '0.5em 0.65em',
              }}/>
            </button>
          </div>
        </Layout>
      </>
    );
  }
}

Start.propTypes = {
  transcript: PropTypes.any,
  resetTranscript: PropTypes.any,
  browserSupportsSpeechRecognition: PropTypes.any
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

const options = {
  autoStart: false
};

export default SpeechRecognition(options)(Start);
