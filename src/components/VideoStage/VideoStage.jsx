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
      title: "Continue assistindo",
      unlockHint: "desbloqueie a maior parte da série e siga sem interrupções",
    };
  }
  if (episode === 7 || episode === 8) {
    return {
      price: "6,90",
      title: "Libere os próximos episódios",
      unlockHint: "adicione créditos e continue assistindo agora",
    };
  }
  if (episode === 9 || episode === 10) {
    return {
      price: "19,90",
      title: "Série completa",
      unlockHint: "libere o acesso completo e assista até o final hoje",
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
    title: "Desbloqueie o acesso premium",
    unlockHint: "libere a maior parte dos episódios e continue assistindo agora",
  });

  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const paywallShownRef = useRef(false);
  const touchStartY = useRef(null);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 1024 : false;

  const hasLocalVideo = useMemo(() => episode >= 1 && episode <= 10, [episode]);

  const videoSrc = useMemo(() => {
    if (!hasLocalVideo) return null;
    return getEpisodeVideoUrl(episode);
  }, [episode, hasLocalVideo]);

  const offer = useMemo(() => getPaywallOffer(episode), [episode]);
  const shouldAutoPaywall = !!offer; // ep6-10

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const open = () => setOpenPaywall(true);
  const close = () => {
    setOpenPaywall(false);
    paywallShownRef.current = true; // evita loop no mesmo play
  };

  // reseta ao trocar episódio
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

    // estilo reels: no mobile, já começa a rodar (se tiver vídeo)
    if (isMobile && videoSrc) {
      setPlaying(true);
    }
  }, [episode, videoSrc, isMobile]);

  // agenda o paywall depois que começar a tocar
  const schedulePaywallIfNeeded = () => {
    if (!shouldAutoPaywall) return;
    if (paywallShownRef.current) return;

    if (offer) setPaywall(offer);

    clearTimer();
    timeoutRef.current = setTimeout(() => {
      // pausa e abre paywall
      try {
        videoRef.current?.pause();
      } catch {}
      setOpenPaywall(true);
    }, 2000);
  };

  const handlePlay = () => {
    if (!videoSrc) {
      setPaywall({
        price: "19,90",
        title: "Série completa",
        unlockHint: "libere o acesso completo para continuar assistindo",
      });
      open();
      return;
    }

    setPlaying(true);

    // ✅ aqui garante o paywall do ep6+ SEM depender de listener
    schedulePaywallIfNeeded();
  };

  // se o vídeo estiver autoplay no mobile, agenda paywall quando o <video> montar
  useEffect(() => {
    if (!playing) return;
    if (!videoSrc) return;

    // dá 1 tick pro ref existir e então agenda
    const t = setTimeout(() => {
      schedulePaywallIfNeeded();
    }, 0);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, videoSrc, episode]);

  // -------- Reels swipe (mobile) --------
  const clampEpisode = (n) => Math.max(1, Math.min(maxEpisode, n));

  const goNext = () => onChangeEpisode?.(clampEpisode(episode + 1));
  const goPrev = () => onChangeEpisode?.(clampEpisode(episode - 1));

  const onTouchStart = (e) => {
    if (!isMobile) return;
    touchStartY.current = e.touches?.[0]?.clientY ?? null;
  };

  const onTouchEnd = (e) => {
    if (!isMobile) return;
    const startY = touchStartY.current;
    const endY = e.changedTouches?.[0]?.clientY ?? null;
    touchStartY.current = null;
    if (startY == null || endY == null) return;

    const delta = endY - startY;
    const threshold = 60;
    if (Math.abs(delta) < threshold) return;

    if (delta < 0) goNext();
    else goPrev();
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
            />
          )}

          <div className={styles.watermark}>R</div>

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
        title={paywall.title}
        unlockHint={paywall.unlockHint}
        onPay={() => alert("Checkout ainda não integrado 🙂")}
      />
    </section>
  );
}
