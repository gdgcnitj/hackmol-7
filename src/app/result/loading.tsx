import styles from "./loading.module.css";

export default function ResultLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.loader} aria-hidden="true"></div>
      <p className={styles.text}>Loading results...</p>
    </div>
  );
}
