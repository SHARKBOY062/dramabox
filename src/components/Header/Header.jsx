import IconButton from "../IconButton/IconButton.jsx";
import styles from "./Header.module.css";
import logo from "../../assets/logoreel.png";

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Zm7.94 9h-3.17a15.4 15.4 0 0 0-1.36-6.02A8.03 8.03 0 0 1 19.94 11Zm-5.25 0H9.31c.18-2.16.8-4.2 1.79-5.73c.57-.9 1.2-1.27 1.41-1.27c.21 0 .84.37 1.41 1.27c1 1.53 1.61 3.57 1.77 5.73ZM4.06 11a8.03 8.03 0 0 1 4.53-6.02A15.4 15.4 0 0 0 7.23 11H4.06Zm0 2h3.17c.18 2.22.73 4.33 1.36 6.02A8.03 8.03 0 0 1 4.06 13Zm5.25 0h5.38c-.16 2.16-.78 4.2-1.77 5.73c-.57.9-1.2 1.27-1.41 1.27c-.21 0-.84-.37-1.41-1.27c-.99-1.53-1.61-3.57-1.79-5.73Zm6.1 6.02c.63-1.69 1.18-3.8 1.36-6.02h3.17a8.03 8.03 0 0 1-4.53 6.02Z"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.iconSm} aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <div className={styles.left}>
          <a className={styles.brand} href="#" aria-label="Página inicial">
            <img className={styles.logoImg} src={logo} alt="Logo" />
          </a>

          <nav className={styles.nav} aria-label="Navegação principal">
            <a className={styles.link} href="#">
              Início
            </a>
            <a className={styles.link} href="#">
              Categorias
            </a>
            <a className={styles.link} href="#">
              Fã-Club
            </a>
            <a className={styles.link} href="#">
              Marca
            </a>
          </nav>
        </div>

        <div className={styles.right}>
          <div className={styles.actions} aria-label="Ações">
            <IconButton label="pesquisar" icon="search" />
            <IconButton label="Download" icon="download" />
            <IconButton label="Histórico" icon="clock" />
          </div>

          <button className={styles.langBtn} type="button" aria-label="Idioma">
            <GlobeIcon />
            <span className={styles.langText}>Português</span>
            <ChevronDownIcon />
          </button>

          <button className={styles.avatarBtn} type="button" aria-label="Perfil">
            <span className={styles.avatar} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
