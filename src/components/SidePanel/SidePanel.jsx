import { movie } from "../../data/mock.js";
import TagPills from "../TagPills/TagPills.jsx";
import StatsRow from "../StatsRow/StatsRow.jsx";
import RangeTabs from "../RangeTabs/RangeTabs.jsx";
import EpisodeGrid from "../EpisodeGrid/EpisodeGrid.jsx";
import styles from "./SidePanel.module.css";

export default function SidePanel() {
  return (
    <aside className={styles.panel}>
      <div className={styles.breadcrumb}>
        <span className={styles.crumbMuted}>Início</span>
        <span className={styles.slash}>/</span>
        <span className={styles.crumbMuted}>{movie.shortTitle}</span>
        <span className={styles.slash}>/</span>
        <span className={styles.crumbActive}>Trailer</span>
      </div>

      <h2 className={styles.title}>{movie.title}</h2>

      <h3 className={styles.sectionTitle}>Enredo do Trailer</h3>
      <p className={styles.description}>
        {movie.description} <button className={styles.more}>...Mais</button>
      </p>

      <TagPills tags={movie.tags} />

      <div className={styles.divider} />

      <StatsRow likes={movie.likes} views={movie.views} />

      <div className={styles.divider} />

      <div className={styles.episodesHeader}>
        <RangeTabs />
        <button className={styles.allEpisodes} type="button">
          Todos os episódios <span className={styles.chev}>›</span>
        </button>
      </div>

      <EpisodeGrid total={49} />
    </aside>
  );
}
