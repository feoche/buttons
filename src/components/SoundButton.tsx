import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toFileName } from "../utils/helpers";
import { playSound } from "../utils/audioManager";
import { useAudioProgress } from "../hooks/useAudioProgress";
import ProgressRing from "./ProgressRing";
import type { SoundButton as SoundButtonType } from "../types";

interface SoundButtonProps {
  button: SoundButtonType;
  index: number;
  activeButton: number | null;
  setActiveButton: (index: number) => void;
  onToggleFav: (button: SoundButtonType) => void;
}

function SoundButtonInner({
  button,
  index,
  activeButton,
  setActiveButton,
  onToggleFav,
}: SoundButtonProps) {
  const handleClick = useCallback(() => {
    setActiveButton(index);
    playSound(button, false);
  }, [button, index, setActiveButton]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setActiveButton(index);
      playSound(button, true);
    },
    [button, index, setActiveButton]
  );

  const handleToggleFav = useCallback(
    () => onToggleFav(button),
    [button, onToggleFav]
  );

  const fileName = button.title ? toFileName(button.title) : "";
  const isActive = activeButton === index;
  const progress = useAudioProgress(isActive ? button.fullPath : undefined);

  return (
    <div
      className="button"
      data-first-letter={button.title ? button.title.toLowerCase()[0] : ""}
      onContextMenu={handleContextMenu}
    >
      <div className={`button-container${isActive ? " active" : ""}`}>
        <ProgressRing progress={progress} size={66} strokeWidth={3} />
        <div className="item" onClick={handleClick} />
        <div
          className={`fav-button${button.fav ? " active" : ""}`}
          onClick={handleToggleFav}
        >
          <span>{button.fav ? "🟊" : "✰"}</span>
        </div>
        {button.title && (
          <Link className="link" to={`/${fileName}`}>
            <div className="title">{button.title}</div>
          </Link>
        )}
        {button.description && (
          <div className="description">{button.description}</div>
        )}
      </div>
    </div>
  );
}

const SoundButton = memo(SoundButtonInner);

export default SoundButton;
