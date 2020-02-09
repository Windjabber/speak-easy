import React, {useState, useEffect} from "react";
import { Link } from "gatsby";

export const Door = ({title, path}) => {
  const [color, setColor] = useState("bright");

  const colors = ["bright", "light-brown", "grey", "light-grey", "blue", "pink", "orange", "red", "purple"];

  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, [])

  return <Link
    to={`/decks/${path}/slides/0`}
    bg="#fff"
  >
    <div className={`door door-${color}`}/>
    <h4 className="door-header center-xs">{title}</h4>
  </Link>;
}
