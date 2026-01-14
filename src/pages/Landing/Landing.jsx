import { useCallback, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import VideoStage from "../../components/VideoStage/VideoStage.jsx";
import SidePanel from "../../components/SidePanel/SidePanel.jsx";
import styles from "./Landing.module.css";

export default function Landing() {
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const handleSelectEpisode = useCallback((ep) => {
    setSelectedEpisode(ep);
  }, []);

  const handleChangeEpisode = useCallback((nextEp) => {
    setSelectedEpisode((prev) => {
      if (nextEp === prev) return prev;
      return nextEp;
    });
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.contentWrap}>
        <div className={styles.contentGrid}>
          <VideoStage
            episode={selectedEpisode}
            maxEpisode={49}
            onChangeEpisode={handleChangeEpisode}
          />

          <SidePanel
            selectedEpisode={selectedEpisode}
            onSelectEpisode={handleSelectEpisode}
          />
        </div>
      </div>
    </div>
  );
}
