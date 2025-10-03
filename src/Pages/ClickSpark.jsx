import React, { useEffect } from "react";
import { gsap } from "gsap";

export default function ClickSpark({ children }) {
  useEffect(() => {
    const handleClick = (e) => {
      const spark = document.createElement("div");
      spark.className = "spark";
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      document.body.appendChild(spark);

      gsap.fromTo(
        spark,
        { scale: 0, opacity: 1 },
        { scale: 2, opacity: 0, duration: 0.6, onComplete: () => spark.remove() }
      );
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
}
