import { useState, useCallback, useEffect, useRef } from "react";
import {
  downloadAllSounds,
  clearSoundCache,
  getCachedCount,
} from "../utils/soundCache";
import type { ButtonCategory } from "../types";

const GITHUB_REPO = "feoche/buttons";

const CATEGORY_OPTIONS: { value: ButtonCategory; label: string }[] = [
  { value: "humour", label: "😂 Humour" },
  { value: "meme", label: "🌐 Meme" },
  { value: "musique", label: "🎵 Musique" },
  { value: "gaming", label: "🎮 Gaming" },
  { value: "film", label: "🎬 Film & TV" },
  { value: "sfx", label: "🔔 SFX" },
  { value: "autre", label: "📦 Autre" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  // ── Cache state ──
  const [cachedCount, setCachedCount] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [clearing, setClearing] = useState(false);

  // ── Add-sound form state ──
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState<ButtonCategory>("humour");
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Refresh cached count when sidebar opens
  useEffect(() => {
    if (open) {
      getCachedCount().then(setCachedCount);
    }
  }, [open]);

  // ── Download all sounds ──
  const handleDownload = useCallback(async () => {
    setDownloading(true);
    setProgress({ done: 0, total: 0 });
    try {
      await downloadAllSounds((done, total) => setProgress({ done, total }));
      const count = await getCachedCount();
      setCachedCount(count);
    } finally {
      setDownloading(false);
    }
  }, []);

  // ── Clear cache ──
  const handleClear = useCallback(async () => {
    setClearing(true);
    await clearSoundCache();
    setCachedCount(0);
    setClearing(false);
  }, []);

  // ── Submit new sound (creates a GitHub issue as a proxy for PR) ──
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      setSubmitting(true);
      setSubmitMsg("");

      const kw = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const body = [
        `## New sound request`,
        ``,
        `| Field | Value |`,
        `|-------|-------|`,
        `| **Title** | ${title} |`,
        `| **Description** | ${description || "—"} |`,
        `| **Video** | ${video || "—"} |`,
        `| **Keywords** | ${kw.length ? kw.join(", ") : "—"} |`,
        `| **Category** | ${category} |`,
        `| **Sound file** | ${soundFile ? soundFile.name : "—"} |`,
        ``,
        `> Submitted from the Buttons app.`,
      ].join("\n");

      const issueTitle = encodeURIComponent(`[New Sound] ${title}`);
      const issueBody = encodeURIComponent(body);
      const url = `https://github.com/${GITHUB_REPO}/issues/new?title=${issueTitle}&body=${issueBody}&labels=new-sound`;

      window.open(url, "_blank");

      setSubmitting(false);
      setSubmitMsg("Opened GitHub — attach the sound file there!");
      setTitle("");
      setDescription("");
      setVideo("");
      setKeywords("");
      setSoundFile(null);
      if (fileRef.current) fileRef.current.value = "";
    },
    [title, description, video, keywords, category, soundFile]
  );

  // ── Close on Escape ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay${open ? " sidebar-overlay--open" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`sidebar${open ? " sidebar--open" : ""}`}>
        {/* Close */}
        <button className="sidebar__close" onClick={onClose}>
          ✕
        </button>

        <div className="sidebar__content">
          {/* ── Cache section ── */}
          <section className="sidebar__section">
            <h3 className="sidebar__heading">💾 Sons en cache</h3>
            <p className="sidebar__text">
              {cachedCount} son{cachedCount !== 1 ? "s" : ""} en cache
            </p>

            <button
              className="sidebar__btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading
                ? `⏳ ${progress.done}/${progress.total}`
                : "⬇ Télécharger tous les sons"}
            </button>

            <button
              className="sidebar__btn sidebar__btn--danger"
              onClick={handleClear}
              disabled={clearing || cachedCount === 0}
            >
              {clearing ? "⏳ Suppression..." : "🗑 Supprimer le cache"}
            </button>
          </section>

          {/* ── Add sound section ── */}
          <section className="sidebar__section">
            <h3 className="sidebar__heading">➕ Proposer un son</h3>
            <form className="sidebar__form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Titre *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="ID vidéo YouTube"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
              />
              <input
                type="text"
                placeholder="Mots-clés (séparés par des virgules)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ButtonCategory)
                }
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label className="sidebar__file-label">
                📎 {soundFile ? soundFile.name : "Fichier son (.mp3)"}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".mp3,audio/mpeg"
                  onChange={(e) => setSoundFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <button
                type="submit"
                className="sidebar__btn sidebar__btn--accent"
                disabled={submitting || !title.trim()}
              >
                🚀 Soumettre sur GitHub
              </button>
              {submitMsg && (
                <p className="sidebar__success">{submitMsg}</p>
              )}
            </form>
          </section>
        </div>

        {/* ── Footer ── */}
        <footer className="sidebar__footer">
          <p>
            <strong>Clic gauche</strong> — jouer le son
          </p>
          <p>
            <strong>Clic droit</strong> — jouer en boucle
          </p>
          <p>
            <strong>Clic sur ✰</strong> — ajouter aux favoris
          </p>
        </footer>
      </aside>
    </>
  );
}

