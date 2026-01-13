import { useState } from "react";
import styles from "./RangeTabs.module.css";

export default function RangeTabs() {
  const [active, setActive] = useState("0-49");

  return (
    <div className={styles.tabs}>
      <button
        type="button"
        className={`${styles.tab} ${active === "0-49" ? styles.active : ""}`}
        onClick={() => setActive("0-49")}
      >
        0 - 49
      </button>

      <button
        type="button"
        className={`${styles.tab} ${active === "50-71" ? styles.active : ""}`}
        onClick={() => setActive("50-71")}
      >
        50 - 71
      </button>
    </div>
  );
}
