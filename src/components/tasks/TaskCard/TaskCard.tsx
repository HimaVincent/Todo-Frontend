import styles from "./TaskCard.module.scss";
import { TodayIcon, EditIcon, DuplicateIcon, DeleteIcon } from "../../../assets/icons";

interface TaskCardProps {
  id: number;
  title: string;
  category: string;
  dueAt?: string | null;
  description?: string;
  onDeleteTask: (taskId: number) => void;
  onSetTaskToToday: (taskId: number) => void;
  onDuplicateTask: (taskId: number) => void;
  onEditTask: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
  completed: boolean;
}

export function TaskCard({
  id,
  title,
  category,
  dueAt,
  description,
  onDeleteTask,
  onSetTaskToToday,
  onDuplicateTask,
  onEditTask,
  onToggleComplete,
  completed,
}: TaskCardProps) {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Australia/Melbourne",
  });
  const taskDate = dueAt ? dueAt.split("T")[0] : null;
  const dueDateVariant = taskDate === null ? "unscheduled" : taskDate < today ? "overdue" : taskDate === today ? "today" : "scheduled";
  const formattedDueDate = dueAt ? new Date(dueAt).toLocaleDateString("en-GB") : "No due date";

  return (
    <article className={styles["task-card"]}>
      <div className={styles["task-card__main"]}>
        <button
          type="button"
          className={`${styles["task-card__checkbox"]} ${completed ? styles["task-card__checkbox--checked"] : ""}`}
          onClick={() => onToggleComplete(id)}
          aria-label="Mark task as completed"
        >
          {completed ? "✓" : null}
        </button>
        <div className={styles["task-card__content"]}>
          <h3 className={styles["task-card__title"]}>{title}</h3>

          <div className={styles["task-card__meta"]}>
            <span className={`${styles["task-card__badge"]} ${styles[`task-card__badge--${dueDateVariant}`]}`}>{`Due: ${formattedDueDate}`}</span>
            <span className={`${styles["task-card__badge"]} ${category === "Uncategorised" ? styles["task-card__badge--uncategorised"] : ""}`}>
              {category}
            </span>
          </div>

          {description ? <p className={styles["task-card__description"]}>{description}</p> : null}
        </div>
      </div>

      <div className={styles["task-card__actions"]}>
        <button
          className={`${styles["task-card__icon-button"]} ${styles["task-card__icon-button--today"]}`}
          type="button"
          title="Set task to today"
          aria-label="Set due today"
          onClick={() => onSetTaskToToday(id)}
        >
          <TodayIcon />
        </button>

        <button
          className={`${styles["task-card__icon-button"]} ${styles["task-card__icon-button--edit"]}`}
          type="button"
          title="Edit task"
          aria-label="Edit task"
          onClick={() => onEditTask(id)}
        >
          <EditIcon />
        </button>

        <button
          className={`${styles["task-card__icon-button"]} ${styles["task-card__icon-button--duplicate"]}`}
          type="button"
          title="Duplicate task"
          aria-label="Duplicate task"
          onClick={() => onDuplicateTask(id)}
        >
          <DuplicateIcon />
        </button>

        <button
          className={`${styles["task-card__icon-button"]} ${styles["task-card__icon-button--delete"]}`}
          type="button"
          title="Delete task"
          aria-label="Delete task"
          onClick={() => onDeleteTask(id)}
        >
          <DeleteIcon />
        </button>
      </div>
    </article>
  );
}
