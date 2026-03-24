import styles from "./TaskCard.module.scss";
import { TodayIcon, EditIcon, DuplicateIcon, DeleteIcon } from "../../../assets/icons";

interface TaskCardProps {
  title: string;
  category: string;
  dueAt?: string | null;
  description?: string;
}

export function TaskCard({ title, category, dueAt, description }: TaskCardProps) {
  return (
    <article className={styles["task-card"]}>
      <div className={styles["task-card__main"]}>
        <div className={styles["task-card__checkbox"]} />
        <div className={styles["task-card__content"]}>
          <h3 className={styles["task-card__title"]}>{title}</h3>

          <div className={styles["task-card__meta"]}>
            <span className={styles["task-card__badge"]}>{category}</span>
            <span className={styles["task-card__badge"]}>{dueAt || "No due date"}</span>
          </div>

          {description ? <p className={styles["task-card__description"]}>{description}</p> : null}
        </div>
      </div>

      <div className={styles["task-card__actions"]}>
        <button className={`${styles["task-card__icon-button"]} ${styles["task-card__icon-button--today"]}`} type="button" aria-label="Set due today">
          <TodayIcon />
        </button>

        <button className={`${styles["task-card__icon-button"]} ${styles["task-card__icon-button--edit"]}`} type="button" aria-label="Edit task">
          <EditIcon />
        </button>

        <button
          className={`${styles["task-card__icon-button"]} ${styles["task-card__icon-button--duplicate"]}`}
          type="button"
          aria-label="Duplicate task"
        >
          <DuplicateIcon />
        </button>

        <button className={`${styles["task-card__icon-button"]} ${styles["task-card__icon-button--delete"]}`} type="button" aria-label="Delete task">
          <DeleteIcon />
        </button>
      </div>
    </article>
  );
}
