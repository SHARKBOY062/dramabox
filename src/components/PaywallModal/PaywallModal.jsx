import { useEffect, useRef } from "react";
import styles from "./PaywallModal.module.css";

function ShieldIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4 5v6c0 5.55 3.84 10.74 8 11 4.16-.26 8-5.45 8-11V5l-8-3Zm-1 14-3-3 1.41-1.41L11 13.17l4.59-4.58L17 10l-6 6Z"
      />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M9 16.17 4.83 12 3.41 13.41 9 19l12-12-1.41-1.41L9 16.17Z"
      />
    </svg>
  );
}

export default function PaywallModal({
  open,
  onClose,
  price = "9,90",       // episódio
  fullPrice = "15,90",  // completo
  title = "Continue assistindo",
  onPayEpisode,
  onPayFull,
  unlockHint = "desbloqueie este episódio e continue assistindo agora",
}) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    // trava scroll atrás
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // foca no fechar
    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleEpisodePay = () => {
    if (onPayEpisode) return onPayEpisode();
    alert("Checkout (episódio) ainda não integrado 🙂");
  };

  const handleFullPay = () => {
    if (onPayFull) return onPayFull();
    alert("Checkout (série completa) ainda não integrado 🙂");
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Paywall"
      // não fecha clicando fora
      onClick={() => {}}
    >
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

        <div className={styles.topRow}>
          <span className={styles.badge}>PREMIUM</span>
          <span className={styles.trust}>
            <ShieldIcon className={styles.trustIcon} />
            Pagamento seguro • Liberação imediata
          </span>
        </div>

        <h3 className={styles.title}>{title}</h3>

        <p className={styles.text}>
          Você está a um passo de continuar sem interrupções. Escolha a melhor opção:
        </p>

        <ul className={styles.bullets}>
          <li className={styles.bulletItem}>
            <CheckIcon className={styles.bulletIcon} />
            Liberação instantânea após confirmação
          </li>
          <li className={styles.bulletItem}>
            <CheckIcon className={styles.bulletIcon} />
            Sem assinaturas — pagamento único
          </li>
          <li className={styles.bulletItem}>
            <CheckIcon className={styles.bulletIcon} />
            Continue exatamente de onde parou
          </li>
        </ul>

        <div className={styles.actions}>
          {/* Destaque: completo */}
          <button className={styles.primary} type="button" onClick={handleFullPay}>
            <span className={styles.btnTop}>
              Assistir todos os episódios
              <span className={styles.btnPrice}>R$ {fullPrice}</span>
            </span>
            <span className={styles.primarySub}>
              Melhor custo-benefício para maratonar até o final
            </span>
          </button>

          {/* Secundário: só episódio */}
          <button className={styles.secondary} type="button" onClick={handleEpisodePay}>
            <span className={styles.btnTop}>
              Desbloquear este episódio
              <span className={styles.btnPriceAlt}>R$ {price}</span>
            </span>
            <span className={styles.secondarySub}>{unlockHint}</span>
          </button>
        </div>

        <p className={styles.footnote}>
          Ao fechar, o acesso continua bloqueado. Ao tocar em um episódio travado, esta tela aparecerá novamente.
          <span className={styles.scarcity}> Condições podem variar por título.</span>
        </p>
      </div>
    </div>
  );
}
