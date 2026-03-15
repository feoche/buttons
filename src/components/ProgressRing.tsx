import { memo } from "react";

interface ProgressRingProps {
  /** 0 – 1 */
  progress: number;
  /** SVG size in px */
  size: number;
  /** Stroke width in px */
  strokeWidth?: number;
}

function ProgressRingInner({
  progress,
  size,
  strokeWidth = 3,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const isActive = progress > 0 && progress < 1;

  return (
    <svg
      className={`progress-ring${isActive ? " progress-ring--active" : ""}${progress >= 1 ? " progress-ring--complete" : ""}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        className="progress-ring__track"
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
      <circle
        className="progress-ring__fill"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
        }}
      />
    </svg>
  );
}

const ProgressRing = memo(ProgressRingInner);
export default ProgressRing;

