import { useState, useEffect, useCallback, useMemo } from "react";
import SoundButton from "./SoundButton";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";
import { saveButton, saveButtons, loadStoredButtons } from "../utils/helpers";
import { useButtonData } from "../hooks/useButtonData";
import type { SoundButton as SoundButtonType } from "../types";

const BATCH_SIZE = 120;
const BATCH_INTERVAL_MS = 200;
const RANDOM_INTERVAL_MS = 2000;

function mergeWithStored(
  data: SoundButtonType[],
  stored: SoundButtonType[]
): SoundButtonType[] {
  const merged = data.map((item) => {
    const match = stored.find(
      (s) => s.title === item.title && s.type === item.type
    );
    return match ? { ...item, fav: match.fav } : item;
  });

  // Append user-created buttons from localStorage
  for (const item of stored) {
    if (item.type === "user") {
      merged.push(item);
    }
  }

  return merged;
}

function pickRandom(buttons: SoundButtonType[]): SoundButtonType {
  return {
    ...buttons[Math.floor(Math.random() * buttons.length)]!,
    title: "???",
  };
}

export default function AllButtons() {
  const rawData = useButtonData();
  const [buttons, setButtons] = useState<SoundButtonType[]>([]);
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("all");
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [limit, setLimit] = useState(BATCH_SIZE);
  const [randomButton, setRandomButton] = useState<SoundButtonType | null>(
    null
  );

  // Merge fetched data with localStorage on load
  useEffect(() => {
    if (rawData.length === 0) return;
    const stored = loadStoredButtons();
    const merged = mergeWithStored(rawData, stored);
    setButtons(merged);
    saveButtons(merged);
  }, [rawData]);

  // Progressive rendering
  useEffect(() => {
    if (buttons.length === 0) return;
    const id = setInterval(() => {
      setLimit((prev) => {
        if (prev > buttons.length) {
          clearInterval(id);
          return -1;
        }
        return prev + BATCH_SIZE;
      });
    }, BATCH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [buttons.length]);

  // Random button rotation
  useEffect(() => {
    if (buttons.length === 0) return;
    setRandomButton(pickRandom(buttons));
    const id = setInterval(
      () => setRandomButton(pickRandom(buttons)),
      RANDOM_INTERVAL_MS
    );
    return () => clearInterval(id);
  }, [buttons]);

  // Fav toggle handler passed to children — avoids window event hack
  const handleToggleFav = useCallback((button: SoundButtonType) => {
    const newFav = !button.fav || undefined;
    const updated: SoundButtonType = { ...button, fav: newFav };
    saveButton(updated);
    setButtons((prev) =>
      prev.map((b) =>
        b.title === button.title && b.type === button.type
          ? { ...b, fav: newFav }
          : b
      )
    );
  }, []);

  // Memoised sort + filter pipeline
  const sortedButtons = useMemo(
    () =>
      [...buttons].sort((a, b) =>
        (a.title ?? "").localeCompare(b.title ?? "")
      ),
    [buttons]
  );

  // Favorites — always visible as a separate row (unless filtering by another category)
  const favoriteButtons = useMemo(
    () => sortedButtons.filter((btn) => btn.fav),
    [sortedButtons]
  );

  const displayedButtons = useMemo(
    () => (limit === -1 ? sortedButtons : sortedButtons.slice(0, limit)),
    [sortedButtons, limit]
  );

  const filteredButtons = useMemo(() => {
    // Category filter
    let result = displayedButtons;
    if (category === "favorites") {
      result = result.filter((btn) => btn.fav);
    } else if (category !== "all") {
      result = result.filter((btn) => btn.category === category);
    }

    // Exclude favorites from the main grid (they have their own row)
    // unless the user is specifically filtering by favorites
    if (category !== "favorites") {
      result = result.filter((btn) => !btn.fav);
    }

    // Text search filter
    const q = filter.toLowerCase();
    if (!q) return result;
    return result.filter((btn) => {
      const inTitle = btn.title?.toLowerCase().includes(q);
      const inDesc = btn.description?.toLowerCase().includes(q);
      const inKw = btn.keywords?.some((kw) => kw.toLowerCase().includes(q));
      return inTitle || inDesc || inKw;
    });
  }, [displayedButtons, filter, category]);

  // Also filter the favorites row by search query
  const filteredFavorites = useMemo(() => {
    const q = filter.toLowerCase();
    if (!q) return favoriteButtons;
    return favoriteButtons.filter((btn) => {
      const inTitle = btn.title?.toLowerCase().includes(q);
      const inDesc = btn.description?.toLowerCase().includes(q);
      const inKw = btn.keywords?.some((kw) => kw.toLowerCase().includes(q));
      return inTitle || inDesc || inKw;
    });
  }, [favoriteButtons, filter]);


  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  return (
    <div className="container all">
      <HeaderBar
        filter={filter}
        onFilterChange={setFilter}
        category={category}
        onCategoryChange={setCategory}
        onMenuToggle={toggleSidebar}
      />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {filteredFavorites.length > 0 && category !== "favorites" && (
        <div className="favorites-row">
          <div className="favorites-row__label">⭐ Favoris</div>
          <div className="favorites-row__list">
            {filteredFavorites.map((button, idx) => (
              <SoundButton
                key={`fav-${button.title}-${idx}`}
                button={button}
                index={idx + 10000}
                activeButton={activeButton}
                setActiveButton={setActiveButton}
                onToggleFav={handleToggleFav}
              />
            ))}
          </div>
        </div>
      )}
      <div className="buttons">
        {filteredButtons.map((button, idx) => (
          <SoundButton
            key={`${button.title}-${idx}`}
            button={button}
            index={idx}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
            onToggleFav={handleToggleFav}
          />
        ))}
        {randomButton && (
          <SoundButton
            button={randomButton}
            index={buttons.length + 1}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
            onToggleFav={handleToggleFav}
          />
        )}
      </div>
    </div>
  );
}

