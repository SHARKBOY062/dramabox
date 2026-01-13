import styles from "./PaywallModal.module.css";

export default function PaywallModal({
  open,
  onClose,
  price = "9,90",
  title = "Desbloqueie o acesso completo",
  onPay,
}) {
  if (!open) return null;

  const handlePay = () => {
    if (onPay) return onPay();
    alert("Checkout ainda não integrado 🙂");
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Paywall"
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        <div className={styles.badgeRow}>
          <span className={styles.badge}>PREMIUM</span>
          <span className={styles.microTrust}>Pagamento seguro • Liberação imediata</span>
        </div>

        <h3 className={styles.title}>{title}</h3>

        <p className={styles.text}>
          Você está a um passo de continuar assistindo sem interrupções.
          Por apenas <strong className={styles.price}>R$ {price}</strong>, você libera
          <strong> todos os episódios</strong> e assiste até o final hoje mesmo.
        </p>

        <ul className={styles.bullets}>
          <li>✅ Acesso total à temporada (todos os episódios liberados)</li>
          <li>✅ Assista sem travar: prioridade de reprodução</li>
          <li>✅ Conteúdo exclusivo e lançamentos primeiro</li>
          <li>✅ Suporte ao criador: mais séries novas toda semana</li>
        </ul>

        <div className={styles.valueBox}>
          <div className={styles.valueLeft}>
            <div className={styles.valueTitle}>Oferta de desbloqueio</div>
            <div className={styles.valueSub}>Menos que um café — e vale a série inteira.</div>
          </div>
          <div className={styles.valueRight}>
            <div className={styles.valuePrice}>R$ {price}</div>
            <div className={styles.valueOnce}>pagamento único</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.secondary} onClick={onClose} type="button">
            Agora não
          </button>

          <button className={styles.primary} type="button" onClick={handlePay}>
            Desbloquear por R$ {price}
          </button>
        </div>

        <p className={styles.footnote}>
          🔒 Compra protegida. Se não for pra você, é só fechar e continuar depois.
          <span className={styles.scarcity}> Oferta pode mudar a qualquer momento.</span>
        </p>
      </div>
    </div>
  );
}
