import styles from "./EpisodeGrid.module.css";

/* ===== ÍCONES ===== */
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon}>
      <path
        fill="currentColor"
        d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm3 8H9V7a3 3 0 1 1 6 0v3Z"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon}>
      <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

/* ===== ACESSO ===== */
function getAccess() {
  try {
    return JSON.parse(localStorage.getItem("dramabox_access")) || {
      full: false,
      episodes: [],
    };
  } catch {
    return { full: false, episodes: [] };
  }
}

function canAccessEpisode(n) {
  const access = getAccess();

  if (n <= 5) return true;          // sempre livre
  if (access.full) return true;     // série completa
  return access.episodes.includes(n);
}

export default function EpisodeGrid({
  total = 49,
  selected = 1,
  onSelectEpisode,
  onRequestPaywall,
}) {
  const episodes = Array.from({ length: total }, (_, i) => i + 1);

  const handleClick = (n) => {
    if (canAccessEpisode(n)) {
      onSelectEpisode?.(n);
    } else {
      onRequestPaywall?.(n); // passa o episódio travado
    }
  };

  return (
    <div className={styles.wrap} role="list" aria-label="Lista de episódios">
      {episodes.map((n) => {
        const unlocked = canAccessEpisode(n);
        const isSelected = n === selected;

        return (
          <button
            key={n}
            type="button"
            role="listitem"
            onClick={() => handleClick(n)}
            className={[
              styles.ep,
              unlocked ? styles.unlocked : styles.locked,
              isSelected ? styles.selected : "",
            ].join(" ")}
            aria-label={
              unlocked
                ? `Episódio ${n} disponível`
                : `Episódio ${n} bloqueado`
            }
            title={
              unlocked
                ? `Episódio ${n}`
                : "Desbloqueie para continuar assistindo"
            }
          >
            <span className={styles.number}>{n}</span>

            <span className={styles.trailing} aria-hidden="true">
              {unlocked ? (
                isSelected ? <PlayIcon /> : <span className={styles.dot} />
              ) : (
                <LockIcon />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
