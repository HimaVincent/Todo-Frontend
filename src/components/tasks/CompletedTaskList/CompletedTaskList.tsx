import { useEffect, useState } from "react";
import styles from "./CompletedTaskList.module.scss";
import { RestoreIcon, DeleteIcon } from "../../../assets/icons";
import { EmptyState } from "../../common/EmptyState/EmptyState";

interface Task {
  id: number;
  title: string;
  category: string;
  dueAt?: string | null;
  description?: string;
  completed: boolean;
}

interface CompletedTaskListProps {
  tasks: Task[];
  onRestoreTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export function CompletedTaskList({ tasks, onRestoreTask, onDeleteTask }: CompletedTaskListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setExpandedId(null);
  }, [tasks]);

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={styles["completed-task-list"]}>
      <h3 className={styles["completed-task-list__title"]}>
        <span>Completed tasks ({tasks.length})</span>
      </h3>

      <div className={styles["completed-task-list__items"]}>
        {tasks.map((task) => {
          const isExpanded = expandedId === task.id;

          return (
            <article key={task.id} className={styles["completed-task-list__item"]}>
              <button
                type="button"
                className={styles["completed-task-list__summary"]}
                onClick={() => handleToggleExpand(task.id)}
                aria-expanded={isExpanded}
              >
                <span className={styles["completed-task-list__checkbox"]}>✓</span>

                <div className={styles["completed-task-list__content"]}>
                  <p className={styles["completed-task-list__task-title"]}>{task.title}</p>
                </div>

                <span className={styles["completed-task-list__chevron"]}>{isExpanded ? "⌄" : "›"}</span>
              </button>

              <div className={`${styles["completed-task-list__body"]} ${isExpanded ? styles["completed-task-list__body--expanded"] : ""}`}>
                <div className={styles["completed-task-list__body-content"]}>
                  <div className={styles["completed-task-list__meta"]}>
                    <span className={styles["completed-task-list__badge"]}>{task.category}</span>
                    <span className={styles["completed-task-list__badge"]}>{task.dueAt || "No due date"}</span>
                  </div>

                  {task.description ? <p className={styles["completed-task-list__description"]}>{task.description}</p> : null}

                  <div className={styles["completed-task-list__actions"]}>
                    <button
                      type="button"
                      className={`${styles["completed-task-list__icon-button"]} ${styles["completed-task-list__icon-button--restore"]}`}
                      onClick={() => onRestoreTask(task.id)}
                      title="Restore task"
                      aria-label="Restore task"
                    >
                      <RestoreIcon />
                    </button>

                    <button
                      type="button"
                      className={`${styles["completed-task-list__icon-button"]} ${styles["completed-task-list__icon-button--delete"]}`}
                      onClick={() => onDeleteTask(task.id)}
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
