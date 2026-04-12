import { useMemo, useCallback, useEffect } from "react";
import { playSound } from "../utils/audioManager";
import { useAudioProgress } from "../hooks/useAudioProgress";
import { getButtonColorVars } from "../utils/buttonColors";
import ProgressRing from "./ProgressRing";
import type { SoundButton } from "../types";

function buildVideoUrl(video: string): string {
  const sep = video.includes("?") ? "&" : "?";
  return `//www.youtube.com/embed/${video}${sep}controls=0&theme=dark&showinfo=0&rel=0&modestbranding=1`;
}

interface ButtonDetailModalProps {
  button: SoundButton;
  onClose: () => void;
}

export default function ButtonDetailModal({
  button,
  onClose,
}: ButtonDetailModalProps) {
  const videoUrl = useMemo(
    () => (button.video ? buildVideoUrl(button.video) : undefined),
    [button.video]
  );

  // Auto-play on open, close on Escape, lock body scroll
  useEffect(() => {
    playSound(button, false);
  }, [button]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const progress = useAudioProgress(button.fullPath);
  const colorVars = useMemo(() => getButtonColorVars(button.title), [button.title]);
  const handlePlay = useCallback(() => playSound(button, false), [button]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handlePlayKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handlePlay(); }
    },
    [handlePlay]
  );

  return (
    <div className="detail-modal-overlay" onClick={handleOverlayClick}>
      <div className="detail-modal">
        <button className="detail-modal__close" onClick={onClose}>✕</button>
        <div className="detail-modal__body">
          <div className="button">
            <div className="button-container">
              <ProgressRing progress={progress} size={90} strokeWidth={3.5} />
              <div
                className="item"
                role="button"
                tabIndex={0}
                aria-label={`Play ${button.title}`}
                onClick={handlePlay}
                onKeyDown={handlePlayKey}
                style={colorVars}
              />
            </div>
          </div>
          <div className="detail-modal__title">{button.title}</div>
          {button.description && (
            <div className="detail-modal__description">{button.description}</div>
          )}
          {videoUrl && (
            <iframe
              className="detail-modal__video"
              width="640"
              height="360"
              src={videoUrl}
              style={{ border: 0 }}
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
