import Link from "next/link";
import styles from "../login/login.module.css";

export default function AuthWelcomePage() {
  return <div className={styles.page}><div className={styles.welcome}>
    <div className={styles.appIcon} role="img" aria-label="Con Cưng" />
    <h1>ConCưng Mẹ&Bé</h1>
    <p>"Đồng Hành Cùng Mẹ — Chăm Sóc Bé Yêu"</p>
    <div className={styles.portrait} role="img" aria-label="Minh họa mẹ ôm bé yêu" />
    <div className={styles.welcomeActions}><Link href="/login" className={styles.primary}>Đăng nhập</Link><Link href="/register" className={styles.secondary}>Đăng ký</Link></div>
  </div></div>;
}
