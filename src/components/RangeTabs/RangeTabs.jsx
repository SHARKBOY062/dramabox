import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./RangeTabs.module.css";

const RANGES = [
  { id: "0-49", label: "0 – 49", start: 0, end: 49 },
  { id: "50-71", label: "50 – 71", start: 50, end: 71 },
];

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.chev} aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.41 7.41 14 12l-4.59 4.59L8 15.17 11.17 12 8 8.83l1.41-1.42Z"
      />
    </svg>
  );
}

export default function RangeTabs({
  value,
  defaultValue = "0-49",
  onChange,
}) {
  const isControlled = value != null;
  const [internal, setInternal] = useState(defaultValue);
  const activeId = isControlled ? value : internal;

  const activeIndex = useMemo(
    () => Math.max(0, RANGES.findIndex((r) => r.id === activeId)),
    [activeId]
  );

  const underlineRef = useRef(null);
  const btnRefs = useRef([]);

  const activeRange = RANGES[activeIndex] ?? RANGES[0];

  const setActive = (id) => {
    if (!isControlled) setInternal(id);
    const r = RANGES.find((x) => x.id === id) || RANGES[0];
    onChange?.(id, { start: r.start, end: r.end });
  };

  useEffect(() => {
    const el = btnRefs.current[activeIndex];
    const ul = underlineRef.current;
    if (!el || !ul) return;

    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement.getBoundingClientRect();
    ul.style.width = `${rect.width}px`;
    ul.style.transform = `translateX(${rect.left - parentRect.left}px)`;
  }, [activeIndex]);

  const onKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();

    const dir = e.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (activeIndex + dir + RANGES.length) % RANGES.length;
    const nextId = RANGES[nextIndex].id;

    setActive(nextId);
    btnRefs.current[nextIndex]?.focus();
  };

  const countText = `${activeRange.start}–${activeRange.end}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <div className={styles.titleRow}>
          <GridIcon />
          <span className={styles.title}>Episódios</span>
          <span className={styles.badge}>{countText}</span>
        </div>

        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Faixas de episódios"
          onKeyDown={onKeyDown}
        >
          {RANGES.map((r, idx) => {
            const active = r.id === activeId;
            return (
              <button
                key={r.id}
                ref={(node) => (btnRefs.current[idx] = node)}
                type="button"
                role="tab"
                aria-selected={active}
                className={`${styles.tab} ${active ? styles.active : ""}`}
                onClick={() => setActive(r.id)}
              >
                {r.label}
              </button>
            );
          })}

          <span ref={underlineRef} className={styles.underline} aria-hidden="true" />
        </div>
      </div>

      <button className={styles.moreBtn} type="button" aria-label="Ver todos os episódios">
        <span className={styles.moreText}>Todos</span>
        <ChevronIcon />
      </button>
    </div>
  );
}
