import styles from "./StatsRow.module.css";

export default function StatsRow({ likes, views }) {
  return (
    <div className={styles.row}>
      <div className={styles.item}>
        <span className={styles.icon}>♡</span>
        <span className={styles.value}>{likes}</span>
      </div>

      <div className={styles.item}>
        <span className={styles.icon}>★</span>
        <span className={styles.value}>{views}</span>
      </div>

      <button className={styles.share} type="button">
        <span className={styles.shareIcon}>↗</span>
        Compartilhar
      </button>
    </div>
  );
}
