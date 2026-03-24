import styles from "./CategorySearch.module.scss";

export function CategorySearch() {
  return <input className={styles["category-search"]} type="text" placeholder="Search categories" />;
}
