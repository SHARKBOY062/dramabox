import styles from "./IconButton.module.css";

const icons = {
  search: (
    <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 4a6 6 0 1 0 3.8 10.6l4.8 4.8 1.4-1.4-4.8-4.8A6 6 0 0 0 10 4Zm0 2a4 4 0 1 1 0 8a4 4 0 0 1 0-8Z"
      />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3h2v9l3-3 1.4 1.4-5.4 5.4-5.4-5.4L9 9l3 3V3ZM5 19h14v2H5v-2Z"
      />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Zm1 5v5.4l3.6 2.1-1 1.7L11 13V7h2Z"
      />
    </svg>
  ),
  back: (
    <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.7 6.3L9 12l5.7 5.7 1.4-1.4L11.8 12l4.3-4.3-1.4-1.4Z"
      />
    </svg>
  ),
};

export default function IconButton({ icon, label }) {
  return (
    <button className={styles.btn} type="button" aria-label={label} title={label}>
      {icons[icon]}
      <span className={styles.text}>{label}</span>
    </button>
  );
}
