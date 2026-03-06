import styles from "./SearchBar.module.css";

function SearchBar({ value, onChange, onSearch, onTitleClick, isSearching }) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title} onClick={onTitleClick}>
        Airbnb AI
      </h1>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.shiftKey &&
            !e.altKey &&
            !e.ctrlKey &&
            !e.metaKey
          ) {
            e.preventDefault();
            if (!isSearching) onSearch();
          }
        }}
        placeholder="Ask for a quiet place in Seattle..."
        className={styles.input}
      />
      <button
        onClick={onSearch}
        className={styles.button}
        disabled={isSearching}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
