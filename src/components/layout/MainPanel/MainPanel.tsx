import { CompletedTaskList } from "../../tasks/CompletedTaskList/CompletedTaskList";
import { TaskList } from "../../tasks/TaskList/TaskList";
import { TaskToolbar } from "../../tasks/TaskToolbar/TaskToolbar";
import styles from "./MainPanel.module.scss";

type FilterVariant = "today" | "overdue" | "scheduled" | "unscheduled" | "all" | "completed";

interface Task {
  id: number;
  title: string;
  categoryId: number | null;
  category: string;
  dueAt?: string | null;
  description?: string;
  completed: boolean;
}

interface MainPanelProps {
  activeFilter: FilterVariant;
  onFilterChange: (filter: FilterVariant) => void;
  categories: { id: number; name: string }[];
  activeCategoryId: number | null;
  tasks: Task[];
  onOpenAddTask: () => void;
  onCategoryChange: (id: number | null) => void;
  onDeleteTask: (taskId: number) => void;
  onSetTaskToToday: (taskId: number) => void;
  onDuplicateTask: (taskId: number) => void;
  onEditTask: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
}

export function MainPanel({
  activeFilter,
  onFilterChange,
  categories,
  activeCategoryId,
  tasks,
  onOpenAddTask,
  onCategoryChange,
  onDeleteTask,
  onSetTaskToToday,
  onDuplicateTask,
  onEditTask,
  onToggleComplete,
}: MainPanelProps) {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Australia/Melbourne",
  });
  const getTaskDateValue = (dueAt?: string | null) => {
    if (!dueAt) {
      return null;
    }

    return dueAt.split("T")[0];
  };

  const doesTaskMatchCompletedFilter = (task: Task) => {
    const taskDate = getTaskDateValue(task.dueAt);

    if (activeFilter === "all") {
      return true;
    }

    if (activeFilter === "today") {
      return taskDate === today;
    }

    if (activeFilter === "scheduled") {
      return taskDate !== null && taskDate > today;
    }

    if (activeFilter === "unscheduled") {
      return taskDate === null;
    }

    return false;
  };

  const completedTasks = tasks.filter((task) => task.completed);
  const filteredCompletedTasks = completedTasks.filter(doesTaskMatchCompletedFilter);

  const shouldShowFilteredCompletedSection =
    activeFilter === "all" || activeFilter === "today" || activeFilter === "scheduled" || activeFilter === "unscheduled";

  const melbourneTime = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Melbourne",
    hour: "numeric",
    hour12: false,
  });

  const hour = parseInt(melbourneTime, 10);

  let greeting = "Hey, Good morning!";

  if (hour >= 12 && hour < 17) {
    greeting = "Hey, Good afternoon!";
  } else if (hour >= 17) {
    greeting = "Hey, Good evening!";
  }

  const todayDateValue = new Date().toLocaleDateString("en-CA", {
    timeZone: "Australia/Melbourne",
  });

  const formattedToday = new Date().toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dueTodayCount = tasks.filter((task) => !task.completed && task.dueAt?.split("T")[0] === todayDateValue).length;

  return (
    <section className={styles["main-panel"]}>
      <header className={styles["main-panel__header"]}>
        <h2 className={styles["main-panel__greeting"]}> {greeting}</h2>
        <p className={styles["main-panel__subtitle"]}>
          It's {formattedToday}, there {dueTodayCount === 1 ? "is" : "are"} {dueTodayCount} {dueTodayCount === 1 ? "item" : "items"} due today.
        </p>
      </header>

      <div className={styles["main-panel__toolbar"]}>
        <TaskToolbar onAddTask={onOpenAddTask} />
      </div>

      <div className={styles["main-panel__content"]}>
        {activeFilter === "completed" ? (
          <CompletedTaskList tasks={completedTasks.slice().reverse()} onRestoreTask={onToggleComplete} onDeleteTask={onDeleteTask} />
        ) : (
          <>
            <TaskList
              tasks={tasks}
              filter={activeFilter}
              onFilterChange={onFilterChange}
              activeCategoryId={activeCategoryId}
              onCategoryChange={onCategoryChange}
              categories={categories}
              onDeleteTask={onDeleteTask}
              onSetTaskToToday={onSetTaskToToday}
              onDuplicateTask={onDuplicateTask}
              onEditTask={onEditTask}
              onToggleComplete={onToggleComplete}
            />

            {shouldShowFilteredCompletedSection ? (
              <CompletedTaskList tasks={filteredCompletedTasks.slice().reverse()} onRestoreTask={onToggleComplete} onDeleteTask={onDeleteTask} />
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
