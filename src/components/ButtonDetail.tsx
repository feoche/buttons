import { useMemo, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toFileName } from "../utils/helpers";
import { playSound } from "../utils/audioManager";
import { useButtonData } from "../hooks/useButtonData";
import { useAudioProgress } from "../hooks/useAudioProgress";
import ProgressRing from "./ProgressRing";
import type { SoundButton } from "../types";

function buildVideoUrl(video: string): string {
  const separator = video.includes("?") ? "&" : "?";
  return `//www.youtube.com/embed/${video}${separator}controls=0&theme=dark&showinfo=0&rel=0&modestbranding=1`;
}

export default function ButtonDetail() {
  const { fileName } = useParams<{ fileName: string }>();
  const data = useButtonData();

  const buttonDetail: SoundButton | undefined = useMemo(() => {
    const found = data.find((item) => toFileName(item.title) === fileName);
    if (!found) return undefined;
    return {
      ...found,
      videoUrl: found.video ? buildVideoUrl(found.video) : undefined,
    };
  }, [data, fileName]);

  // Auto-play through the shared audio manager on mount
  useEffect(() => {
    if (buttonDetail) {
      playSound(buttonDetail, false);
    }
  }, [buttonDetail]);

  const progress = useAudioProgress(buttonDetail?.fullPath);

  const handlePlay = useCallback(() => {
    if (buttonDetail) {
      playSound(buttonDetail, false);
    }
  }, [buttonDetail]);

  if (!buttonDetail) return null;

  return (
    <div className="container button-detail">
      <Link className="back-button" to="/">
        &lt; Home
      </Link>
      <div className="button">
        <div className="button-container">
          <ProgressRing progress={progress} size={100} strokeWidth={3.5} />
          <div className="item" onClick={handlePlay} />
        </div>
        <div className="title">{buttonDetail.title}</div>
        {buttonDetail.description && (
          <div className="description">{buttonDetail.description}</div>
        )}
        {buttonDetail.videoUrl && (
          <iframe
            id="ytplayer"
            width="640"
            height="390"
            src={buttonDetail.videoUrl}
            style={{ border: 0 }}
          />
        )}
      </div>
    </div>
  );
}
