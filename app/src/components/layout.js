import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { navigate } from "gatsby";

const Layout = ({ className, children }) => {
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

  return (
    <>
      <main className={className}>{children}</main>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Layout;
