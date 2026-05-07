import styles from "./CategorySearch.module.scss";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function CategorySearch({ value, onChange }: Props) {
  return (
    <input
      className={styles["category-search"]}
      type="text"
      placeholder="Search categories"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
