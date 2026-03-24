import { TaskCard } from "../TaskCard/TaskCard";
import { TaskFilterChips } from "../TaskFilterChips/TaskFilterChips";
import styles from "./TaskList.module.scss";
import { EmptyIcon } from "../../../assets/icons";

type FilterVariant = "today" | "overdue" | "scheduled" | "unscheduled" | "all" | "completed";

interface Category {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  categoryId: number | null;
  category: string;
  dueAt?: string | null;
  description?: string;
  filterType: string;
}

interface TaskListProps {
  tasks: Task[];
  filter: FilterVariant;
  onFilterChange: (filter: FilterVariant) => void;
  activeCategoryId: number | null;
  categories: Category[];
}

export function TaskList({ tasks, filter, onFilterChange, activeCategoryId, categories }: TaskListProps) {
  const activeCategoryName = activeCategoryId === null ? null : (categories.find((category) => category.id === activeCategoryId)?.name ?? null);

  const filterMatchedTasks = filter === "all" ? tasks : tasks.filter((task) => task.filterType === filter);

  const visibleTasks = activeCategoryId === null ? filterMatchedTasks : filterMatchedTasks.filter((task) => task.categoryId === activeCategoryId);

  const title = activeCategoryName === null ? (filter === "all" ? "All tasks" : "Tasks") : activeCategoryName;

  return (
    <div className={styles["task-list"]}>
      <div className={styles["task-list__header"]}>
        <div className={styles["task-list__chip-slot"]}>
          {filter !== "all" ? <TaskFilterChips activeFilter={filter} onClear={() => onFilterChange("all")} /> : null}
        </div>

        <h2 className={styles["task-list__title"]}>{title}</h2>
      </div>

      {visibleTasks.length > 0 ? (
        <div className={styles["task-list__items"]}>
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} title={task.title} category={task.category} dueAt={task.dueAt} description={task.description} />
          ))}
        </div>
      ) : (
        <div className={styles["task-list__empty"]}>
          <div className={styles["task-list__empty-icon"]}>
            <EmptyIcon />
          </div>
          <h3 className={styles["task-list__empty-title"]}>No tasks found</h3>
          <p className={styles["task-list__empty-text"]}>Try a different search or add a new task.</p>
        </div>
      )}
    </div>
  );
}
