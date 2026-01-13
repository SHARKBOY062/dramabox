import Header from "../../components/Header/Header.jsx";
import VideoStage from "../../components/VideoStage/VideoStage.jsx";
import SidePanel from "../../components/SidePanel/SidePanel.jsx";
import styles from "./Landing.module.css";

export default function Landing() {
  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.contentWrap}>
        <div className={styles.contentGrid}>
          <VideoStage />
          <SidePanel />
        </div>
      </div>
    </div>
  );
}
