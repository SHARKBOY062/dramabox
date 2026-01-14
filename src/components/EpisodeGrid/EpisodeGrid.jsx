import styles from "./EpisodeGrid.module.css";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm3 8H9V7a3 3 0 1 1 6 0v3Zm-3 4a2 2 0 0 0-1 3.732V19h2v-1.268A2 2 0 0 0 12 14Z"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export default function EpisodeGrid({
  total = 49,
  selected = 1,
  onSelectEpisode,
  onRequestPaywall, // abre modal para ep11+
}) {
  const episodes = Array.from({ length: total }, (_, i) => i + 1);

  const isUnlocked = (n) => n <= 10; // ✅ livre até o 10

  const handleClick = (n) => {
    if (isUnlocked(n)) {
      onSelectEpisode?.(n);
      return;
    }
    onRequestPaywall?.();
  };

  return (
    <div className={styles.wrap} role="list" aria-label="Lista de episódios">
      {episodes.map((n) => {
        const unlocked = isUnlocked(n);
        const isSelected = n === selected;

        return (
          <button
            key={n}
            type="button"
            role="listitem"
            className={[
              styles.ep,
              unlocked ? styles.unlocked : styles.locked,
              isSelected ? styles.selected : "",
            ].join(" ")}
            onClick={() => handleClick(n)}
            aria-label={unlocked ? `Episódio ${n} disponível` : `Episódio ${n} bloqueado`}
            title={unlocked ? `Episódio ${n}` : "Desbloqueie para continuar assistindo"}
          >
            <span className={styles.number}>{n}</span>

            <span className={styles.trailing} aria-hidden="true">
              {unlocked ? (isSelected ? <PlayIcon /> : <span className={styles.dot} />) : <LockIcon />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
