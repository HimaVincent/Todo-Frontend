import styles from "./TaskToolbar.module.scss";

interface TaskToolbarProps {
  onAddTask: () => void;
}

export function TaskToolbar({ onAddTask }: TaskToolbarProps) {
  return (
    <div className={styles["task-toolbar"]}>
      <input className={styles["task-toolbar__search"]} type="text" placeholder="Search tasks" />

      <select className={styles["task-toolbar__sort"]} defaultValue="title-asc">
        <option value="title-asc">Title (A to Z)</option>
        <option value="title-desc">Title (Z to A)</option>
        <option value="due-date-asc">Due date (Ascending)</option>
        <option value="due-date-desc">Due date (Descending)</option>
      </select>

      <button className={styles["task-toolbar__button"]} type="button" onClick={onAddTask}>
        + Add task
      </button>
    </div>
  );
}
