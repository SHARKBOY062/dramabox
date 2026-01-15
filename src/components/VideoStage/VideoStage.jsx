import { useEffect, useMemo, useRef, useState } from "react";
import PaywallModal from "../PaywallModal/PaywallModal.jsx";
import styles from "./VideoStage.module.css";
import banner from "../../assets/banneret.png";
import { getEpisodeVideoUrl } from "../../utils/episodeVideo.js";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.playIcon}>
      <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

/* ===== ACESSO LOCAL ===== */
function getAccess() {
  try {
    return JSON.parse(localStorage.getItem("dramabox_access")) || {
      full: false,
      episodes: [],
    };
  } catch {
    return { full: false, episodes: [] };
  }
}

function hasAccess(ep) {
  const access = getAccess();
  if (access.full) return true;
  return access.episodes.includes(ep);
}

/* ===== PAYWALL POR EP ===== */
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
  const [blocked, setBlocked] = useState(false); // 🔒 TRAVA REAL
  const [paywall, setPaywall] = useState({ price: "9,90", fullPrice: "15,90", title: "" });

  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const touchStartY = useRef(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const hasVideo = episode >= 1 && episode <= 10;
  const videoSrc = useMemo(
    () => (hasVideo ? getEpisodeVideoUrl(episode) : null),
    [episode, hasVideo]
  );

  const access = useMemo(getAccess, [episode]);

  /* ===== RESET AO TROCAR EP ===== */
  useEffect(() => {
    setPlaying(false);
    setOpenPaywall(false);
    setBlocked(false);
    clearTimeout(timerRef.current);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [episode]);

  /* ===== PAYWALL APÓS 4s ===== */
  const schedulePaywall = () => {
    if (hasAccess(episode)) return;

    const offer = getPaywallOffer(episode);
    if (!offer) return;

    setPaywall(offer);

    timerRef.current = setTimeout(() => {
      videoRef.current?.pause();
      setBlocked(true);        // 🔒 trava
      setOpenPaywall(true);
    }, 4000);
  };

  /* ===== PLAY ===== */
  const handlePlay = (e) => {
    e.stopPropagation();

    // 🔒 bloqueado → sempre abre paywall
    if (blocked && !hasAccess(episode)) {
      setOpenPaywall(true);
      return;
    }

    if (!videoSrc) {
      setPaywall({ price: "19,90", fullPrice: "15,90", title: "Série completa" });
      setBlocked(true);
      setOpenPaywall(true);
      return;
    }

    setPlaying(true);

    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {});
      schedulePaywall();
    });
  };

  /* ===== SWIPE REELS (SÓ SE LIBERADO) ===== */
  const onTouchStart = (e) => {
    if (!isMobile || !playing || blocked) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (!isMobile || !playing || blocked) return;

    const delta = e.changedTouches[0].clientY - touchStartY.current;
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
            {!access.full && episode >= 6 && (
              <span className={styles.premiumTag}>Premium</span>
            )}
          </div>
        </div>
      </div>

      <PaywallModal
        open={openPaywall}
        episode={episode}
        price={paywall.price}
        fullPrice={paywall.fullPrice}
        title={paywall.title}
        onClose={() => setOpenPaywall(false)}
        onUnlocked={() => {
          clearTimeout(timerRef.current);
          setBlocked(false);     // 🔓 LIBERA DE VERDADE
          setOpenPaywall(false);
          setPlaying(true);
          requestAnimationFrame(() => videoRef.current?.play());
        }}
      />
    </section>
  );
}
