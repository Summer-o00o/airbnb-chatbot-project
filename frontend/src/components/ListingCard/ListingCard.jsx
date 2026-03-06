import styles from "./ListingCard.module.css";

function ListingCard({ listing, showQuietScore = false, compact = false }) {
  return (
    <div className={styles.card}>
      <img
        src={`https://picsum.photos/400/250?random=${listing.id}`}
        alt={listing.title}
        className={styles.image}
      />
      <h3 className={styles.title}>{listing.title}</h3>
      {!compact && (
        <>
          <p>{listing.location}</p>
          <p>
            {listing.bedrooms ?? 0} bedrooms · {listing.bathrooms ?? 0}{" "}
            {listing.bathrooms > 1 ? "baths" : "bath"}
          </p>
          {showQuietScore && (
            <p>
              Quiet Score:{" "}
              {listing.quietScore != null
                ? Number(listing.quietScore).toFixed(2)
                : "No reviews"}{" "}
              ({listing.reviewCount ?? 0})
            </p>
          )}
          <p className={styles.price}>${listing.price} / night</p>
        </>
      )}
    </div>
  );
}

export default ListingCard;
