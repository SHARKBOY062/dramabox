import styles from "./TagPills.module.css";

export default function TagPills({ tags = [] }) {
  return (
    <div className={styles.wrap}>
      {tags.map((t) => (
        <span key={t} className={styles.pill}>
          {t}
        </span>
      ))}
    </div>
  );
}
