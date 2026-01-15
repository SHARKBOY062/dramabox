import { useEffect, useRef, useState } from "react";
import styles from "./PaywallModal.module.css";

export default function PaywallModal({
  open,
  onClose,
  episode,
  price = "9,90",
  fullPrice = "15,90",
  title = "Continue assistindo",
  unlockHint = "desbloqueie este episódio e continue assistindo agora",
  onUnlocked,
}) {
  const closeBtnRef = useRef(null);
  const pollingRef = useRef(null);

  const [qrCode, setQrCode] = useState(null);
  const [externalId, setExternalId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* trava scroll */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = prev;
      clearInterval(pollingRef.current);
      setQrCode(null);
      setExternalId(null);
      setLoading(false);
    };
  }, [open]);

  if (!open) return null;

  /* cria PIX */
  const createPix = async (amount) => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://dramabox-api.econocja.workers.dev/pix/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount.replace(",", ".")),
            episode,
          }),
        }
      );

      const data = await res.json();
      setQrCode(data.qr_code_text);
      setExternalId(data.external_id);
      startPolling(data.external_id);
    } catch (err) {
      alert("Erro ao criar pagamento PIX");
      setLoading(false);
    }
  };

  /* polling automático */
  const startPolling = (external_id) => {
    pollingRef.current = setInterval(async () => {
      const res = await fetch(
        `https://dramabox-api.econocja.workers.dev/pix/status/${external_id}`
      );
      const data = await res.json();

      if (data.status === "PAID") {
        clearInterval(pollingRef.current);
        unlockEpisode();
      }
    }, 3000);
  };

  /* libera episódio */
  const unlockEpisode = () => {
    const access =
      JSON.parse(localStorage.getItem("dramabox_access")) || {
        full: false,
        episodes: [],
      };

    if (!access.episodes.includes(episode)) {
      access.episodes.push(episode);
    }

    localStorage.setItem("dramabox_access", JSON.stringify(access));
    onUnlocked?.();
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeBtnRef}
          className={styles.close}
          onClick={onClose}
          aria-label="Fechar"
        >
          ✕
        </button>

        <h3 className={styles.title}>{title}</h3>

        {!qrCode && (
          <>
            <p className={styles.text}>{unlockHint}</p>

            <div className={styles.actions}>
              <button
                className={styles.primary}
                disabled={loading}
                onClick={() => createPix(fullPrice)}
              >
                Assistir todos os episódios — R$ {fullPrice}
              </button>

              <button
                className={styles.secondary}
                disabled={loading}
                onClick={() => createPix(price)}
              >
                Desbloquear este episódio — R$ {price}
              </button>
            </div>
          </>
        )}

        {qrCode && (
          <>
            <p className={styles.text}>Escaneie o QR Code PIX</p>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${qrCode}`}
              alt="QR Code PIX"
              className={styles.qr}
            />

            <p className={styles.footnote}>
              Aguardando confirmação do pagamento…
            </p>
          </>
        )}
      </div>
    </div>
  );
}
