import { memo } from "react";

const CATEGORIES = [
  { value: "all", label: "🔊 Tous" },
  { value: "favorites", label: "⭐ Favoris" },
  { value: "meme", label: "🌐 Meme" },
  { value: "humour", label: "😂 Humour" },
  { value: "musique", label: "🎵 Musique" },
  { value: "gaming", label: "🎮 Gaming" },
  { value: "film", label: "🎬 Film & TV" },
  { value: "sfx", label: "🔔 SFX" },
  { value: "autre", label: "📦 Autre" },
];

interface HeaderBarProps {
  filter: string;
  onFilterChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  onMenuToggle: () => void;
}

function HeaderBarInner({
  filter,
  onFilterChange,
  category,
  onCategoryChange,
  onMenuToggle,
}: HeaderBarProps) {
  return (
    <header className="header-bar">
      <button
        className="header-bar__burger"
        onClick={onMenuToggle}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>
      <input
        className="header-bar__search"
        autoFocus
        placeholder="Search..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      />
      <select
        className="header-bar__category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </header>
  );
}

const HeaderBar = memo(HeaderBarInner);
export default HeaderBar;

