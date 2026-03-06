import styles from "./AISummaryPanel.module.css";

function AISummaryPanel({
  message,
  aiFilters,
  footerText,
  variant = "card",
}) {
  const wrapperClass =
    variant === "sidebar"
      ? `${styles.wrapper} ${styles.wrapperSidebar}`
      : `${styles.wrapper} ${styles.wrapperCard}`;

  return (
    <div className={wrapperClass}>
      <div className={styles.pattern} aria-hidden />
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>AI Summary</h3>
          <span className={styles.badge}>Powered by AI</span>
        </div>
        <p
          className={
            aiFilters ? `${styles.message} ${styles.messageWithFilters}` : styles.message
          }
        >
          {message}
        </p>
        {aiFilters && (
          <>
            <div className={styles.divider} />
            <div className={styles.filtersLabel}>Filters applied</div>
            <ul className={styles.filtersList}>
              <li className={styles.filterItem}>
                <span className={styles.label}>Location</span>:{" "}
                <span className={styles.value}>
                  {aiFilters.location?.trim() ? aiFilters.location : "Any"}
                </span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.label}>Bedrooms</span>:{" "}
                <span className={styles.value}>
                  {aiFilters.bedrooms == null
                    ? "Any"
                    : aiFilters.exactBedrooms
                      ? `Exactly ${aiFilters.bedrooms}`
                      : `At least ${aiFilters.bedrooms}`}
                </span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.label}>Bathrooms</span>:{" "}
                <span className={styles.value}>
                  {aiFilters.bathrooms == null
                    ? "Any"
                    : aiFilters.exactBathrooms
                      ? `Exactly ${aiFilters.bathrooms}`
                      : `At least ${aiFilters.bathrooms}`}
                </span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.label}>Backyard</span>:{" "}
                <span className={styles.value}>
                  {aiFilters.hasBackyard == null
                    ? "Any"
                    : aiFilters.hasBackyard
                      ? "Must have a backyard"
                      : "Backyard not required"}
                </span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.label}>Quiet</span>:{" "}
                <span className={styles.value}>
                  {aiFilters.minQuietScore == null
                    ? "Any"
                    : `Quiet score ≥ ${aiFilters.minQuietScore}`}
                </span>
              </li>
              <li className={styles.filterItem}>
                <span className={styles.label}>Price</span>:{" "}
                <span className={styles.value}>
                  {aiFilters.minPrice == null && aiFilters.maxPrice == null
                    ? "Any"
                    : aiFilters.minPrice != null && aiFilters.maxPrice != null
                      ? `$${aiFilters.minPrice} - $${aiFilters.maxPrice} / night`
                      : aiFilters.minPrice != null
                        ? `From $${aiFilters.minPrice} / night`
                        : `Up to $${aiFilters.maxPrice} / night`}
                </span>
              </li>
            </ul>
          </>
        )}
        {footerText && <div className={styles.footer}>{footerText}</div>}
      </div>
    </div>
  );
}

export default AISummaryPanel;
