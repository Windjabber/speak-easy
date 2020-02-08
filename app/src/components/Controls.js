import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { navigate } from "gatsby";

const Controls = () => {
  useEffect(() => {
    const handleEsc = event => {
      if (event.keyCode === 27) {
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return <></>;
};

Controls.propTypes = {
  children: PropTypes.node.isRequired
};

export default Controls;
