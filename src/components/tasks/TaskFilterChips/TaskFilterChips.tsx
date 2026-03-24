import styles from "./TaskFilterChips.module.scss";

type FilterVariant = "today" | "overdue" | "scheduled" | "unscheduled" | "all" | "completed";

interface TaskFilterChipsProps {
  activeFilter: FilterVariant;
  onClear: () => void;
}

export function TaskFilterChips({ activeFilter, onClear }: TaskFilterChipsProps) {
  if (activeFilter === "all") {
    return null;
  }

  const label = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);

  return (
    <div className={styles["task-filter-chips"]}>
      <button
        className={`${styles["task-filter-chips__chip"]} ${styles[`task-filter-chips__chip--${activeFilter}`]}`}
        onClick={onClear}
        type="button"
      >
        {label} ×
      </button>
    </div>
  );
}
