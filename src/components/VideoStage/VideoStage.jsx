import { useEffect, useMemo, useRef, useState } from "react";
import IconButton from "../IconButton/IconButton.jsx";
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

function getPaywallOffer(episode) {
  if (episode === 6) {
    return {
      price: "9,90",
      fullPrice: "15,90",
      title: "Continue assistindo",
      unlockHint: "desbloqueie este episódio e continue assistindo agora",
    };
  }

  if (episode === 7 || episode === 8) {
    return {
      price: "6,90",
      fullPrice: "15,90",
      title: "Libere os próximos episódios",
      unlockHint: "adicione créditos e continue assistindo agora",
    };
  }

  if (episode === 9 || episode === 10) {
    return {
      price: "19,90",
      fullPrice: "15,90",
      title: "Série completa",
      unlockHint: "desbloqueie este episódio ou escolha o acesso completo",
    };
  }

  return null;
}

export default function VideoStage({
  episode = 1,
  maxEpisode = 49,
  onChangeEpisode,
}) {
  const [openPaywall, setOpenPaywall] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [paywall, setPaywall] = useState({
    price: "9,90",
    fullPrice: "15,90",
    title: "Desbloqueie para continuar",
    unlockHint: "desbloqueie este episódio e continue assistindo agora",
  });

  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const paywallShownRef = useRef(false);

  // swipe reels
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 1024 : false;

  // vídeos na CDN até o ep10
  const hasRemoteVideo = useMemo(
    () => episode >= 1 && episode <= 10,
    [episode]
  );

  const videoSrc = useMemo(() => {
    if (!hasRemoteVideo) return null;
    return getEpisodeVideoUrl(episode); // ep5 fallback vem do episodeVideo.js
  }, [episode, hasRemoteVideo]);

  const offer = useMemo(() => getPaywallOffer(episode), [episode]);
  const shouldAutoPaywall = !!offer; // ep6-10

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const open = () => setOpenPaywall(true);
  const close = () => {
    setOpenPaywall(false);
    paywallShownRef.current = true; // evita reabrir em loop no mesmo play
  };

  // reset ao trocar episódio
  useEffect(() => {
    clearTimer();
    paywallShownRef.current = false;
    setOpenPaywall(false);
    setPlaying(false);

    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {}
    }

    // estilo reels: no mobile, ao trocar episódio, já começa a tocar
    if (isMobile && videoSrc) {
      setPlaying(true);
    }
  }, [episode, videoSrc, isMobile]);

  // agenda paywall (AGORA 4s)
  const schedulePaywallIfNeeded = () => {
    if (!shouldAutoPaywall) return;
    if (paywallShownRef.current) return;

    if (offer) setPaywall(offer);

    clearTimer();
    timeoutRef.current = setTimeout(() => {
      try {
        videoRef.current?.pause();
      } catch {}
      open();
    }, 4000); // ✅ 4 segundos
  };

  const handlePlay = () => {
    // ep11+ sem vídeo => paywall direto
    if (!videoSrc) {
      setPaywall({
        price: "19,90",
        fullPrice: "15,90",
        title: "Série completa",
        unlockHint: "libere o acesso completo para continuar assistindo",
      });
      open();
      return;
    }

    setPlaying(true);
    schedulePaywallIfNeeded();
  };

  // se autoplay montou o <video>, agenda paywall
  useEffect(() => {
    if (!playing) return;
    if (!videoSrc) return;

    const t = setTimeout(() => {
      schedulePaywallIfNeeded();
    }, 0);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, videoSrc, episode]);

  // -------- swipe reels (mobile) --------
  const clampEpisode = (n) => Math.max(1, Math.min(maxEpisode, n));
  const goNext = () => onChangeEpisode?.(clampEpisode(episode + 1));
  const goPrev = () => onChangeEpisode?.(clampEpisode(episode - 1));

  const onTouchStart = (e) => {
    if (!isMobile) return;
    const t = e.touches?.[0];
    if (!t) return;
    touchStartY.current = t.clientY;
    touchStartX.current = t.clientX;
  };

  const onTouchEnd = (e) => {
    if (!isMobile) return;
    const startY = touchStartY.current;
    const startX = touchStartX.current;
    const t = e.changedTouches?.[0];

    touchStartY.current = null;
    touchStartX.current = null;

    if (startY == null || startX == null || !t) return;

    const deltaY = t.clientY - startY;
    const deltaX = t.clientX - startX;

    // ✅ só troca ep se for swipe vertical forte (reels feel)
    if (Math.abs(deltaY) < 80) return;
    if (Math.abs(deltaX) > Math.abs(deltaY)) return;

    if (deltaY < 0) goNext(); // swipe up
    else goPrev(); // swipe down
  };

  return (
    <section className={styles.stage} aria-label="Player">
      <div className={styles.backWrap}>
        <button className={styles.backBtn} type="button" aria-label="Voltar">
          <span className={styles.backIcon}>
            <IconButton icon="back" label="Voltar" />
          </span>
        </button>
      </div>

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
              aria-label="Banner do episódio"
              role="img"
            />
          )}

          {playing && videoSrc && (
            <video
              ref={videoRef}
              className={styles.video}
              src={videoSrc}
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          )}

          <div className={styles.watermark}>R</div>

          {/* play sempre visível */}
          <button
            className={styles.play}
            type="button"
            aria-label="Assistir"
            onClick={handlePlay}
          >
            <PlayIcon />
          </button>

          <div className={styles.episodeBadge}>
            Episódio {episode}
            {episode >= 6 ? (
              <span className={styles.premiumTag}>Premium</span>
            ) : null}
          </div>
        </div>
      </div>

      <PaywallModal
        open={openPaywall}
        onClose={close}
        price={paywall.price}
        fullPrice={paywall.fullPrice}
        title={paywall.title}
        unlockHint={paywall.unlockHint}
        onPayEpisode={() => alert("Checkout episódio ainda não integrado 🙂")}
        onPayFull={() => alert("Checkout completo ainda não integrado 🙂")}
      />
    </section>
  );
}
