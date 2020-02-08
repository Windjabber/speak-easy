import React, { useEffect } from "react";
import { navigate } from "gatsby";
import { useDeck } from "gatsby-theme-mdx-deck";

export const AutoAdvance = () => {
  const context = useDeck();
  const { slug, index, length } = context;

  useEffect(() => {
    if (length > 1 && index !== length - 1) {
      navigate([slug, length - 1].join('/'))
    }
  }, [slug, index, length]);

  return <></>;
};

export default AutoAdvance;
