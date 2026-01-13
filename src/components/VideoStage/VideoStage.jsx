import { useEffect, useState } from "react";
import IconButton from "../IconButton/IconButton.jsx";
import PaywallModal from "../PaywallModal/PaywallModal.jsx";
import styles from "./VideoStage.module.css";
import banner from "../../assets/banneret.png";

export default function VideoStage() {
  const [openPaywall, setOpenPaywall] = useState(false);

  const open = () => setOpenPaywall(true);
  const close = () => setOpenPaywall(false);

  // Fechar com ESC
  useEffect(() => {
    if (!openPaywall) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPaywall]);

  // Travar scroll quando modal estiver aberto
  useEffect(() => {
    if (!openPaywall) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [openPaywall]);

  return (
    <section className={styles.stage} aria-label="Prévia do vídeo">
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
          style={{ backgroundImage: `url(${banner})` }}
          role="img"
          aria-label="Banner do episódio"
        >
          <div className={styles.watermark}>R</div>

          <button
            className={styles.play}
            type="button"
            aria-label="Assistir"
            onClick={open}
          >
            ▶
          </button>

          {/* Subtitle (opcional) */}
          <div className={styles.subtitle}>O Retorno da Rainha do direito. </div>
        </div>
      </div>

      <PaywallModal
        open={openPaywall}
        onClose={close}
        price="9,90"
        title="Continue assistindo sem interrupções"
        onPay={() => {
          // Futuro: redirecionar para checkout
          alert("Checkout ainda não integrado 🙂");
        }}
      />
    </section>
  );
}
