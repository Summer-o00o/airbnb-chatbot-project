import styles from "./ListingSkeleton.module.css";

function ListingSkeleton({ count = 8, columns = 4, showSubtext = false }) {
  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
          {showSubtext && (
            <>
              <div
                className={`${styles.skeleton} ${styles.skeletonLine} ${styles.skeletonLineWide}`}
              />
              <div
                className={`${styles.skeleton} ${styles.skeletonLine} ${styles.skeletonLineMedium}`}
              />
              <div
                className={`${styles.skeleton} ${styles.skeletonLineNarrow}`}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ListingSkeleton;
