// GameObjectDisplay.jsx
import React from "react";

const GameObjectDisplay = ({ gameObject, style, isPreview = false }) => {
  let backgroundImage;

  switch (gameObject?.type) {
    case "rc_left":
      backgroundImage = "url('/rc_left.png')";
      break;
    case "rc_right":
      backgroundImage = "url('/rc_right.png')";
      break;
    case "fang":
      backgroundImage = "url('/fang.jpg')";
      break;
    case "crawler":
      backgroundImage = "url('/crawler.png')";
      break;
    case "mustang":
      backgroundImage = "url('/mustang.png')";
      break;
    case "sledgehammer":
      backgroundImage = "url('/sledgehammer.png')";
      break;
    case "steelball":
      backgroundImage = "url('/steelball.png')";
      break;
    case "stormcaller":
      backgroundImage = "url('/stormcaller.png')";
      break;
    case "wasp":
      backgroundImage = "url('/wasp.png')";
      break;
    case "fortress":
      backgroundImage = "url('/fortress.png')";
      break;
    case "meltingpoint":
      backgroundImage = "url('/meltingpoint.png')";
      break;
    case "overlord":
      backgroundImage = "url('/overlord.png')";
      break;
    case "vulcan":
      backgroundImage = "url('/vulcan.png')";
      break;
    case "rhino":
      backgroundImage = "url('/rhino.png')";
      break;
    case "hacker":
      backgroundImage = "url('/hacker.png')";
      break;
    case "arclight":
      backgroundImage = "url('/arclight.png')";
      break;
    case "marksman":
      backgroundImage = "url('/marksman.png')";
      break;
    case "phoenix":
      backgroundImage = "url('/phoenix.png')";
      break;
    default:
      backgroundImage = undefined;
      break;
  }

  return (
    <div
      className="gameObject"
      style={{
        ...style,
        backgroundImage,
        backgroundColor: gameObject?.type === "fang" ? "red" : "blue",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        opacity: isPreview ? 0 : 1, // Hide the preview object
      }}
    ></div>
  );
};

export default GameObjectDisplay;
