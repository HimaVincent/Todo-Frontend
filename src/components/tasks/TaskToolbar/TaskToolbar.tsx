import styles from "./TaskToolbar.module.scss";

interface TaskToolbarProps {
  onAddTask: () => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function TaskToolbar({ onAddTask, onSearchChange, onSortChange }: TaskToolbarProps) {
  return (
    <div className={styles["task-toolbar"]}>
      <input className={styles["task-toolbar__search"]} type="text" placeholder="Search tasks" onChange={(e) => onSearchChange(e.target.value)} />

      <select className={styles["task-toolbar__sort"]} defaultValue="newest" onChange={(e) => onSortChange(e.target.value)}>
        <option value="newest">Newest first</option>
        <option value="title-asc">Title (A to Z)</option>
        <option value="title-desc">Title (Z to A)</option>
        <option value="due-date-asc">Due date (Ascending)</option>
        <option value="due-date-desc">Due date (Descending)</option>
      </select>

      <button
        className={styles["task-toolbar__button"]}
        type="button"
        onClick={() => {
          console.log("TaskToolbar button clicked");
          onAddTask();
        }}
      >
        + Add task
      </button>
    </div>
  );
}
