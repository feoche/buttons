import { useState, useEffect, useRef, useCallback } from "react";
import { getAudioElement, getCurrentButtonPath } from "../utils/audioManager";

/**
 * Tracks the playback progress of the shared Audio element
 * for a specific sound source. Returns a value from 0 to 1.
 */
export function useAudioProgress(soundSrc: string | undefined): number {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    const audio = getAudioElement();
    const currentPath = getCurrentButtonPath();

    if (
      soundSrc &&
      currentPath === soundSrc &&
      !audio.paused &&
      audio.duration > 0
    ) {
      setProgress(audio.currentTime / audio.duration);
    } else if (soundSrc && currentPath !== soundSrc) {
      // Different sound is playing — reset our progress
      setProgress(0);
    }
    // If paused on same sound, keep current progress (don't reset)

    rafRef.current = requestAnimationFrame(tick);
  }, [soundSrc]);

  useEffect(() => {
    if (!soundSrc) {
      setProgress(0);
      return;
    }

    const audio = getAudioElement();

    const handleEnded = () => {
      if (getCurrentButtonPath() === soundSrc) {
        setProgress(0);
      }
    };

    audio.addEventListener("ended", handleEnded);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [soundSrc, tick]);

  return progress;
}

