"use client";

import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

/**
 * Circular progress bar component for displaying a score out of 10.
 *
 * Features:
 * - Animates score using useEffect
 * - Displays numeric label inside the circle
 */

const Progressbar = ({ score }: { score: number }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValue(score * 10);
    }, 100);

    return () => clearTimeout(timeout);
  }, [score]);

  return (
    <div className="w-25 h-25">
      <CircularProgressbar
        value={animatedValue}
        text={`${score}/10`}
        strokeWidth={10}
        styles={buildStyles({
          textSize: "16px",
          pathColor: "#06367a",
          pathTransitionDuration: 1,
          textColor: "#06367a",
          trailColor: "#E5E7EB",
        })}
      />
    </div>
  );
};

export default Progressbar;
