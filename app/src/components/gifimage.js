import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";

export const GifImage = ({keyword}) => {
  const [img, setImg] = useState(null);
  useEffect(() => {
    let url = `https://api.giphy.com/v1/gifs/random?api_key=QOkRB2NwM1bPzFDmlO3Vhzykt6FQJgGN&tag=${keyword}&rating=G`;
    fetch(url).then(response => response.json()).then((gifs) => {
      console.log(gifs['data']['image_original_url']);
      console.log(gifs.length);
      setImg(gifs['data']['image_original_url']);
    });
  }, []);

  if (img === null) {
    return null;
  }
  return <img
    src={img}
    alt=''
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: '100%',
      width: '100%',
      objectFit: 'cover',
    }}
  />
};

GifImage.propTypes = {
  keyword: PropTypes.string.isRequired
};

export default GifImage;
