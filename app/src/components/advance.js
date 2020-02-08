import React, { useEffect } from "react";
import { navigate } from "gatsby";
import { useDeck } from "gatsby-theme-mdx-deck";

export const AutoAdvance = () => {
  const {slug, index, length, autoAdvance, setState } = useDeck();

  useEffect(() => {
    const handleA = event => {
      if (event.keyCode === 65) {
        setState(deck => {
          return {
            ...deck,
            autoAdvance: (deck.autoAdvance === null || !deck.autoAdvance)
          }
        }
      )
      }
    };
    window.addEventListener("keydown", handleA);

    return () => {
      window.removeEventListener("keydown", handleA);
    };
  }, [setState]);

  useEffect(() => {
    if (autoAdvance && length > 1 && index !== length - 1) {
      navigate([slug, length - 1].join('/'))
    }
  }, [slug, index, length, autoAdvance]);

  return <></>;
};

export default AutoAdvance;
