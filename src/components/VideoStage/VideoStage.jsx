import { useEffect, useMemo, useRef, useState } from "react";
import PaywallModal from "../PaywallModal/PaywallModal.jsx";
import styles from "./VideoStage.module.css";
import banner from "../../assets/banneret.png";
import { getEpisodeVideoUrl } from "../../utils/episodeVideo.js";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.playIcon} aria-hidden="true">
      <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

/* 🔓 verifica acesso local */
function hasAccess(ep) {
  const data = JSON.parse(localStorage.getItem("dramabox_access"));
  if (!data) return false;
  if (data.full) return true;
  return data.episodes?.includes(ep);
}

function getPaywallOffer(ep) {
  if (ep === 6)
    return { price: "9,90", fullPrice: "15,90", title: "Continue assistindo" };
  if (ep === 7 || ep === 8)
    return { price: "6,90", fullPrice: "15,90", title: "Libere os próximos episódios" };
  if (ep >= 9)
    return { price: "19,90", fullPrice: "15,90", title: "Série completa" };
  return null;
}

export default function VideoStage({ episode = 1, maxEpisode = 49, onChangeEpisode }) {
  const [playing, setPlaying] = useState(false);
  const [openPaywall, setOpenPaywall] = useState(false);
  const [paywall, setPaywall] = useState({ price: "9,90", fullPrice: "15,90", title: "" });

  const videoRef = useRef(null);
  const paywallTimer = useRef(null);
  const paywallShown = useRef(false);
  const touchStartY = useRef(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const hasVideo = episode >= 1 && episode <= 10;
  const videoSrc = useMemo(
    () => (hasVideo ? getEpisodeVideoUrl(episode) : null),
    [episode, hasVideo]
  );

  /* RESET AO TROCAR EP */
  useEffect(() => {
    setPlaying(false);
    setOpenPaywall(false);
    paywallShown.current = false;
    clearTimeout(paywallTimer.current);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [episode]);

  /* PAYWALL APÓS 4s (SE NÃO TIVER ACESSO) */
  const schedulePaywall = () => {
    if (paywallShown.current) return;
    if (hasAccess(episode)) return;

    const offer = getPaywallOffer(episode);
    if (!offer) return;

    setPaywall(offer);

    paywallTimer.current = setTimeout(() => {
      videoRef.current?.pause();
      setOpenPaywall(true);
      paywallShown.current = true;
    }, 4000);
  };

  /* PLAY */
  const handlePlay = (e) => {
    e.stopPropagation();

    if (!videoSrc) {
      setPaywall({ price: "19,90", fullPrice: "15,90", title: "Série completa" });
      setOpenPaywall(true);
      return;
    }

    setPlaying(true);

    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {});
      schedulePaywall();
    });
  };

  /* SWIPE (SÓ SE JÁ ESTIVER TOCANDO) */
  const onTouchStart = (e) => {
    if (!isMobile || !playing) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (!isMobile || !playing) return;

    const endY = e.changedTouches[0].clientY;
    const delta = endY - touchStartY.current;
    touchStartY.current = null;

    if (Math.abs(delta) < 120) return;

    if (delta < 0 && episode < maxEpisode) onChangeEpisode?.(episode + 1);
    if (delta > 0 && episode > 1) onChangeEpisode?.(episode - 1);
  };

  return (
    <section className={styles.stage}>
      <div className={styles.playerShell}>
        <div
          className={styles.player}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {!playing && (
            <div
              className={styles.poster}
              style={{ backgroundImage: `url(${banner})` }}
            />
          )}

          {playing && videoSrc && (
            <video
              ref={videoRef}
              className={styles.video}
              src={videoSrc}
              controls
              playsInline
            />
          )}

          <button className={styles.play} onClick={handlePlay}>
            <PlayIcon />
          </button>

          <div className={styles.episodeBadge}>
            Episódio {episode}
            {episode >= 6 && <span className={styles.premiumTag}>Premium</span>}
          </div>
        </div>
      </div>

      <PaywallModal
        open={openPaywall}
        onClose={() => setOpenPaywall(false)}
        episode={episode}
        price={paywall.price}
        fullPrice={paywall.fullPrice}
        title={paywall.title}
        onUnlocked={() => {
          setOpenPaywall(false);
          setPlaying(true);
          requestAnimationFrame(() => videoRef.current?.play());
        }}
      />
    </section>
  );
}
