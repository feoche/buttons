import { useState, useEffect, useCallback, useMemo } from "react";
import SoundButton from "./SoundButton";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";
import ButtonDetailModal from "./ButtonDetailModal";
import OfflineBanner from "./OfflineBanner";
import { saveButton, saveButtons, loadStoredButtons } from "../utils/helpers";
import { useButtonData } from "../hooks/useButtonData";
import type { SoundButton as SoundButtonType } from "../types";

const BATCH_SIZE = 120;
const BATCH_INTERVAL_MS = 200;
const RANDOM_INTERVAL_MS = 2000;

function mergeWithStored(data: SoundButtonType[], stored: SoundButtonType[]): SoundButtonType[] {
  const merged = data.map((item) => {
    const match = stored.find((s) => s.title === item.title && s.type === item.type);
    return match ? { ...item, fav: match.fav } : item;
  });
  for (const item of stored) {
    if (item.type === "user") merged.push(item);
  }
  return merged;
}

function pickRandom(buttons: SoundButtonType[]): SoundButtonType {
  return { ...buttons[Math.floor(Math.random() * buttons.length)]!, title: "???" };
}

function matchesSearch(btn: SoundButtonType, q: string): boolean {
  return (
    btn.title?.toLowerCase().includes(q) ||
    btn.description?.toLowerCase().includes(q) ||
    btn.keywords?.some((kw) => kw.toLowerCase().includes(q)) ||
    false
  );
}

export default function AllButtons() {
  const rawData = useButtonData();
  const [buttons, setButtons] = useState<SoundButtonType[]>([]);
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("all");
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [limit, setLimit] = useState(BATCH_SIZE);
  const [randomButton, setRandomButton] = useState<SoundButtonType | null>(null);
  const [detailButton, setDetailButton] = useState<SoundButtonType | null>(null);

  useEffect(() => {
    if (rawData.length === 0) return;
    const merged = mergeWithStored(rawData, loadStoredButtons());
    setButtons(merged);
    saveButtons(merged);
  }, [rawData]);

  // Progressive rendering
  useEffect(() => {
    if (buttons.length === 0) return;
    const id = setInterval(() => {
      setLimit((prev) => {
        if (prev > buttons.length) { clearInterval(id); return -1; }
        return prev + BATCH_SIZE;
      });
    }, BATCH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [buttons.length]);

  // Random button rotation
  useEffect(() => {
    if (buttons.length === 0) return;
    setRandomButton(pickRandom(buttons));
    const id = setInterval(() => setRandomButton(pickRandom(buttons)), RANDOM_INTERVAL_MS);
    return () => clearInterval(id);
  }, [buttons]);

  const handleToggleFav = useCallback((button: SoundButtonType) => {
    const updated = { ...button, fav: !button.fav || undefined };
    saveButton(updated);
    setButtons((prev) =>
      prev.map((b) =>
        b.title === button.title && b.type === button.type ? updated : b
      )
    );
  }, []);

  const handleOpenDetail = useCallback((btn: SoundButtonType) => setDetailButton(btn), []);
  const handleCloseDetail = useCallback(() => setDetailButton(null), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  const sortedButtons = useMemo(
    () => [...buttons].sort((a, b) => (a.title ?? "").localeCompare(b.title ?? "")),
    [buttons]
  );

  const favoriteButtons = useMemo(() => sortedButtons.filter((b) => b.fav), [sortedButtons]);

  const filteredButtons = useMemo(() => {
    const displayed = limit === -1 ? sortedButtons : sortedButtons.slice(0, limit);
    const q = filter.toLowerCase();

    let result = displayed;
    if (category === "favorites") result = result.filter((b) => b.fav);
    else if (category !== "all") result = result.filter((b) => b.category === category);

    if (category !== "favorites") result = result.filter((b) => !b.fav);
    if (q) result = result.filter((b) => matchesSearch(b, q));
    return result;
  }, [sortedButtons, limit, filter, category]);

  const filteredFavorites = useMemo(() => {
    const q = filter.toLowerCase();
    return q ? favoriteButtons.filter((b) => matchesSearch(b, q)) : favoriteButtons;
  }, [favoriteButtons, filter]);

  return (
    <div className="container all">
      <HeaderBar
        filter={filter}
        onFilterChange={setFilter}
        category={category}
        onCategoryChange={setCategory}
        onMenuToggle={toggleSidebar}
      />
      <OfflineBanner />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {filteredFavorites.length > 0 && category !== "favorites" && (
        <div className="favorites-row">
          <div className="favorites-row__label">⭐ Favoris</div>
          <div className="favorites-row__list">
            {filteredFavorites.map((button, idx) => (
              <SoundButton
                key={`fav-${button.title}`}
                button={button}
                index={idx + 10000}
                activeButton={activeButton}
                setActiveButton={setActiveButton}
                onToggleFav={handleToggleFav}
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>
        </div>
      )}
      <div className="buttons">
        {filteredButtons.map((button, idx) => (
          <SoundButton
            key={button.title}
            button={button}
            index={idx}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
            onToggleFav={handleToggleFav}
            onOpenDetail={handleOpenDetail}
          />
        ))}
        {randomButton && (
          <SoundButton
            button={randomButton}
            index={buttons.length + 1}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
            onToggleFav={handleToggleFav}
            onOpenDetail={handleOpenDetail}
          />
        )}
      </div>
      {detailButton && (
        <ButtonDetailModal button={detailButton} onClose={handleCloseDetail} />
      )}
    </div>
  );
}
