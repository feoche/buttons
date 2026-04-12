import { memo, useCallback, useMemo } from "react";
import { playSound } from "../utils/audioManager";
import { useAudioProgress } from "../hooks/useAudioProgress";
import { getButtonColorVars } from "../utils/buttonColors";
import ProgressRing from "./ProgressRing";
import type { SoundButton as SoundButtonType } from "../types";

/** Returns a keydown handler that fires `fn` on Enter or Space. */
function onActivate(fn: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };
}

interface SoundButtonProps {
  button: SoundButtonType;
  index: number;
  activeButton: number | null;
  setActiveButton: (index: number) => void;
  onToggleFav: (button: SoundButtonType) => void;
  onOpenDetail: (button: SoundButtonType) => void;
}

function SoundButtonInner({
  button,
  index,
  activeButton,
  setActiveButton,
  onToggleFav,
  onOpenDetail,
}: SoundButtonProps) {
  const play = useCallback(() => {
    setActiveButton(index);
    playSound(button, false);
  }, [button, index, setActiveButton]);

  const playLoop = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setActiveButton(index);
      playSound(button, true);
    },
    [button, index, setActiveButton]
  );

  const toggleFav = useCallback(() => onToggleFav(button), [button, onToggleFav]);
  const openDetail = useCallback(() => onOpenDetail(button), [button, onOpenDetail]);

  const isActive = activeButton === index;
  const progress = useAudioProgress(isActive ? button.fullPath : undefined);
  const colorVars = useMemo(() => getButtonColorVars(button.title), [button.title]);

  return (
    <div
      className="button"
      data-first-letter={button.title?.toLowerCase()[0] ?? ""}
      onContextMenu={playLoop}
    >
      <div className={`button-container${isActive ? " active" : ""}`}>
        <ProgressRing progress={progress} size={66} strokeWidth={3} />
        <div
          className="item"
          role="button"
          tabIndex={0}
          aria-label={`Play ${button.title}`}
          onClick={play}
          onKeyDown={onActivate(play)}
          style={colorVars}
        />
        <div
          className={`fav-button${button.fav ? " active" : ""}`}
          role="button"
          tabIndex={0}
          aria-label={button.fav ? `Remove ${button.title} from favourites` : `Add ${button.title} to favourites`}
          aria-pressed={!!button.fav}
          onClick={toggleFav}
          onKeyDown={onActivate(toggleFav)}
        >
          <span>{button.fav ? "🟊" : "✰"}</span>
        </div>
        {button.title && (
          <div
            className="link"
            role="button"
            tabIndex={0}
            aria-label={`Open details for ${button.title}`}
            onClick={openDetail}
            onKeyDown={onActivate(openDetail)}
          >
            <div className="title">{button.title}</div>
          </div>
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
