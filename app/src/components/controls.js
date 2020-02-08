import React, { useEffect } from "react";
import { navigate } from "gatsby";

export const Controls = () => {
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

export default Controls;
