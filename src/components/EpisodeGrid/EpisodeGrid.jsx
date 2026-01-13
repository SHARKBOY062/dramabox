import styles from "./EpisodeGrid.module.css";

function getStatus(n, access) {
  if (access === "FULL") return "unlocked";
  if (access === "BASIC") return n <= 8 ? "unlocked" : "locked";
  return "locked";
}

function LockIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${styles.icon} ${className}`}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm3 8H9V7a3 3 0 1 1 6 0v3Zm-3 4a2 2 0 0 0-1 3.732V19h2v-1.268A2 2 0 0 0 12 14Z"
      />
    </svg>
  );
}

function PlayIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${styles.icon} ${className}`}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M8 5.5v13l11-6.5-11-6.5Z"
      />
    </svg>
  );
}

export default function EpisodeGrid({
  total = 49,
  access = "NONE", // "NONE" | "BASIC" | "FULL"
  selected = 1,
  onSelectEpisode,
  onRequestBasicPaywall,
  onRequestCreditsPaywall,
}) {
  const episodes = Array.from({ length: total }, (_, i) => i + 1);

  const handleClick = (n) => {
    const status = getStatus(n, access);

    if (status === "unlocked") {
      onSelectEpisode?.(n);
      return;
    }

    if (n <= 8) onRequestBasicPaywall?.();
    else onRequestCreditsPaywall?.();
  };

  return (
    <div className={styles.wrap} role="list" aria-label="Lista de episódios">
      {episodes.map((n) => {
        const status = getStatus(n, access);
        const locked = status !== "unlocked";
        const isSelected = n === selected;

        const className = [
          styles.ep,
          locked ? styles.locked : styles.unlocked,
          isSelected ? styles.selected : "",
        ].join(" ");

        const hint =
          locked
            ? n <= 8
              ? "Pague R$ 9,90 para desbloquear até o episódio 8"
              : "Pague R$ 6,90 para liberar até o final"
            : `Episódio ${n}`;

        return (
          <button
            key={n}
            type="button"
            role="listitem"
            className={className}
            onClick={() => handleClick(n)}
            aria-label={locked ? `Episódio ${n} bloqueado` : `Episódio ${n} disponível`}
            title={hint}
            data-locked={locked ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
          >
            <span className={styles.number}>{n}</span>

            <span className={styles.trailing} aria-hidden="true">
              {locked ? (
                <LockIcon className={styles.lockIcon} />
              ) : isSelected ? (
                <PlayIcon className={styles.playIcon} />
              ) : (
                <span className={styles.dot} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
