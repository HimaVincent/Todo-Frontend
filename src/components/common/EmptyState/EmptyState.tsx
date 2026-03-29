import styles from "./EmptyState.module.scss";
import { EmptyIcon } from "../../../assets/icons";

interface EmptyStateProps {
  title: string;
  text: string;
}

export function EmptyState({ title, text }: EmptyStateProps) {
  return (
    <div className={styles["empty-state"]}>
      <div className={styles["empty-state__icon"]}>
        <EmptyIcon />
      </div>
      <h3 className={styles["empty-state__title"]}>{title}</h3>
      <p className={styles["empty-state__text"]}>{text}</p>
    </div>
  );
}
