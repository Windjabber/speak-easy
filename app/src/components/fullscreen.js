import React from "react";
import PropTypes from "prop-types";

export const FullscreenImage = ({src}) => {
  return <img
    src={src}
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

FullscreenImage.propTypes = {
  src: PropTypes.string.isRequired
};

export default FullscreenImage;
