/*
	jsrepo 1.28.2
	Installed from https://reactbits.dev/default/
	22-01-2025
*/

import { useState } from "react";
import "./LogoWall.scss";

function LogoWall({
  items = [],
  direction = "horizontal",
  pauseOnHover = false,
  size = "clamp(8rem, 1rem + 30vmin, 25rem)",
  duration = "60s",
  textColor = "#ffffff",
  bgColor = "#060606",
  bgAccentColor = "#111111",
}) {
  const [isPaused, setIsPaused] = useState(false);

  const wrapperClass = [
    "wrapper",
    direction === "vertical" && "wrapper--vertical",
  ]
    .filter(Boolean)
    .join(" ");

  const marqueeClass = [
    "marquee",
    direction === "vertical" && "marquee--vertical",
    isPaused && "paused",
  ]
    .filter(Boolean)
    .join(" ");

  const renderItem = (item, key) => {
    if (item.component) {
      return <div key={key} className="review-item">{item.component}</div>;
    }
    return <img key={key} src={item.imgUrl} alt={item.altText} />;
  };

  return (
    <article
      className={wrapperClass}
      style={{
        "--size": size,
        "--duration": duration,
        "--color-text": textColor,
        "--color-bg": bgColor,
        "--color-bg-accent": bgAccentColor,
      }}
    >
      <div
        className={marqueeClass}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <div className="marquee__group">
          {items.map((item, idx) => renderItem(item, idx))}
        </div>
        <div className="marquee__group" aria-hidden="true">
          {items.map((item, idx) => renderItem(item, `dup1-${idx}`))}
        </div>
      </div>

      <div
        className={`${marqueeClass} marquee--reverse`}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <div className="marquee__group">
          {items.map((item, idx) => renderItem(item, `rev-${idx}`))}
        </div>
        <div className="marquee__group" aria-hidden="true">
          {items.map((item, idx) => renderItem(item, `dup2-${idx}`))}
        </div>
      </div>
    </article>
  );
}

export default LogoWall;
