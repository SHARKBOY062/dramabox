import { useMemo, useState } from "react";
import { movie } from "../../data/mock.js";
import TagPills from "../TagPills/TagPills.jsx";
import StatsRow from "../StatsRow/StatsRow.jsx";
import RangeTabs from "../RangeTabs/RangeTabs.jsx";
import EpisodeGrid from "../EpisodeGrid/EpisodeGrid.jsx";
import PaywallModal from "../PaywallModal/PaywallModal.jsx";
import styles from "./SidePanel.module.css";

export default function SidePanel({ selectedEpisode = 1, onSelectEpisode }) {
  // Faixas tipo Netflix (pode ajustar depois)
  const [rangeId, setRangeId] = useState("0-49");
  const [openPaywall, setOpenPaywall] = useState(false);

  const range = useMemo(() => {
    if (rangeId === "50-71") return { start: 50, end: 71 };
    return { start: 0, end: 49 };
  }, [rangeId]);

  // total mostrado na grade = tamanho da faixa (para o grid gerar 1..N)
  // Como seu EpisodeGrid gera 1..total, usamos o total como "quantidade de episódios exibidos".
  // Para faixas, a forma simples é mostrar 49 ou 22 e deixar o label do RangeTabs informar a faixa.
  // Se você quiser mostrar números reais 50–71 na grade, eu adapto o EpisodeGrid para aceitar offset.
  const gridTotal = useMemo(() => {
    return rangeId === "50-71" ? 22 : 49; // 50..71 tem 22 episódios
  }, [rangeId]);

  return (
    <aside className={styles.panel} aria-label="Informações da série">
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
        <RangeTabs
          value={rangeId}
          onChange={(id) => setRangeId(id)}
        />

        <button
          className={styles.allEpisodes}
          type="button"
          onClick={() => setRangeId("0-49")}
        >
          Todos os episódios <span className={styles.chev}>›</span>
        </button>
      </div>

      <EpisodeGrid
        total={gridTotal}
        selected={selectedEpisode}
        onSelectEpisode={onSelectEpisode}
        onRequestPaywall={() => setOpenPaywall(true)}
      />

      <PaywallModal
        open={openPaywall}
        onClose={() => setOpenPaywall(false)}
        price="9,90"
        title="Desbloqueie o acesso premium"
        unlockHint="libere a maior parte dos episódios e continue assistindo agora"
        onPay={() => alert("Checkout ainda não integrado 🙂")}
      />
    </aside>
  );
}
