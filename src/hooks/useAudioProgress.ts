import { useState, useEffect } from "react";
import { getAudioElement, getCurrentButtonPath } from "../utils/audioManager";

/** Tracks playback progress (0–1) of the shared Audio for a given source. */
export function useAudioProgress(soundSrc: string | undefined): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!soundSrc) {
      setProgress(0);
      return;
    }

    const audio = getAudioElement();
    let raf: number;

    const tick = () => {
      const cur = getCurrentButtonPath();
      if (cur === soundSrc && !audio.paused && audio.duration > 0) {
        setProgress(audio.currentTime / audio.duration);
      } else if (cur !== soundSrc) {
        setProgress(0);
      }
      raf = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      if (getCurrentButtonPath() === soundSrc) setProgress(0);
    };

    audio.addEventListener("ended", handleEnded);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [soundSrc]);

  return progress;
}

