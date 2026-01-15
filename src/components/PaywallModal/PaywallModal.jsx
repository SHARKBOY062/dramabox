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

  const [qrCodeText, setQrCodeText] = useState(null);
  const [externalId, setExternalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFullUnlock, setIsFullUnlock] = useState(false);

  /* ===== CONTROLE DE ABERTURA ===== */
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = prev;
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      setQrCodeText(null);
      setExternalId(null);
      setLoading(false);
      setIsFullUnlock(false);
    };
  }, [open]);

  if (!open) return null;

  /* ===== CRIAR PIX ===== */
  const createPix = async (amount, full = false) => {
    try {
      setLoading(true);
      setIsFullUnlock(full);

      const res = await fetch(
        "https://dramabox-api.econocja.workers.dev/pix/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(String(amount).replace(",", ".")),
            episode,
          }),
        }
      );

      if (!res.ok) throw new Error("Erro ao criar PIX");

      const data = await res.json();

      if (!data.external_id || !data.qr_code_text) {
        throw new Error("Resposta PIX inválida");
      }

      setExternalId(data.external_id);
      setQrCodeText(data.qr_code_text);
      setLoading(false);

      startPolling(data.external_id);
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar o PIX. Tente novamente.");
      setLoading(false);
    }
  };

  /* ===== POLLING ===== */
  const startPolling = (external_id) => {
    clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `https://dramabox-api.econocja.workers.dev/pix/status/${external_id}`
        );
        const data = await res.json();

        if (data.status === "paid") {
          clearInterval(pollingRef.current);
          unlockAccess();
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000);
  };

  /* ===== LIBERAÇÃO ===== */
  const unlockAccess = () => {
    const access =
      JSON.parse(localStorage.getItem("dramabox_access")) || {
        full: false,
        episodes: [],
      };

    if (isFullUnlock) {
      access.full = true;
    } else if (!access.episodes.includes(episode)) {
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
          type="button"
        >
          ✕
        </button>

        <h3 className={styles.title}>{title}</h3>

        {!qrCodeText && (
          <>
            <p className={styles.text}>{unlockHint}</p>

            <div className={styles.actions}>
              <button
                className={styles.primary}
                disabled={loading}
                onClick={() => createPix(fullPrice, true)}
              >
                {loading ? "Gerando PIX..." : `Assistir todos — R$ ${fullPrice}`}
              </button>

              <button
                className={styles.secondary}
                disabled={loading}
                onClick={() => createPix(price, false)}
              >
                {loading ? "Gerando PIX..." : `Desbloquear episódio — R$ ${price}`}
              </button>
            </div>
          </>
        )}

        {qrCodeText && (
          <>
            <p className={styles.text}>Escaneie o QR Code PIX</p>

            <img
              className={styles.qr}
              src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                qrCodeText
              )}`}
              alt="QR Code PIX"
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
