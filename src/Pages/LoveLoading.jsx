import React, { useState, useEffect } from "react";
import "./LoveLoading.css";

export default function LoveLoading({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress(progress + 1);
      }, 50); // tốc độ loading
      return () => clearTimeout(timer);
    } else {
      setTimeout(onComplete, 800); // khi full thì gọi callback
    }
  }, [progress, onComplete]);

  return (
    <div className="loading-container">
      <div className="loading-bar">
        <div className="progress" style={{ width: `${progress}%` }}>
          <span className="progress-text">{progress}%</span>
        </div>
      </div>
      <p className="loading-text">LOADING LOVE . . .</p>
      <div className="hearts">
        <span>❤️</span>
        <span>💖</span>
        <span>💕</span>
      </div>
    </div>
  );
}
