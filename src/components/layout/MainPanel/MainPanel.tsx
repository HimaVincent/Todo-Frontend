import { useState } from "react";
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
  completedAt?: string | null;
}

interface MainPanelProps {
  activeFilter: FilterVariant;
  onFilterChange: (filter: FilterVariant) => void;
  categories: { id: number; name: string }[];
  activeCategoryId: number | "uncategorised" | null;
  onCategoryChange: (id: number | "uncategorised" | null) => void;
  tasks: Task[];
  onOpenAddTask: () => void;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("newest");

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

    if (activeFilter === "completed") {
      return true;
    }

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

  const visibleTasks = tasks
    .filter((task) => {
      return task.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortType === "newest") {
        return 0;
      }

      if (sortType === "title-asc") {
        return a.title.localeCompare(b.title);
      }

      if (sortType === "title-desc") {
        return b.title.localeCompare(a.title);
      }

      if (sortType === "due-date-asc") {
        if (!a.dueAt) return 1;
        if (!b.dueAt) return -1;
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      }

      if (sortType === "due-date-desc") {
        if (!a.dueAt) return 1;
        if (!b.dueAt) return -1;
        return new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime();
      }

      return 0;
    });

  const completedTasks = visibleTasks
    .filter((task) => task.completed)
    .sort((a, b) => {
      if (!a.completedAt) return 1;
      if (!b.completedAt) return -1;

      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });

  const filteredCompletedTasks = completedTasks.filter(doesTaskMatchCompletedFilter).filter((task) => {
    if (activeCategoryId === null) {
      return true;
    }

    if (activeCategoryId === "uncategorised") {
      return task.categoryId === null;
    }

    return task.categoryId === activeCategoryId;
  });

  const categoryFilteredCompletedTasks = filteredCompletedTasks.filter((task) => {
    if (activeCategoryId === null) {
      return true;
    }

    if (activeCategoryId === "uncategorised") {
      return task.categoryId === null;
    }

    return task.categoryId === activeCategoryId;
  });

  return (
    <section className={styles["main-panel"]}>
      <header className={styles["main-panel__header"]}>
        <h2 className={styles["main-panel__greeting"]}> {greeting}</h2>
        <p className={styles["main-panel__subtitle"]}>
          It's {formattedToday}, there {dueTodayCount === 1 ? "is" : "are"} {dueTodayCount} {dueTodayCount === 1 ? "item" : "items"} due today.
        </p>
      </header>

      <div className={styles["main-panel__toolbar"]}>
        <TaskToolbar onAddTask={onOpenAddTask} onSearchChange={setSearchQuery} onSortChange={setSortType} />
      </div>

      <div className={styles["main-panel__content"]}>
        {activeFilter === "completed" ? (
          <>
            <TaskList
              tasks={[]}
              filter="completed"
              hideEmptyState
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

            <CompletedTaskList tasks={categoryFilteredCompletedTasks} onRestoreTask={onToggleComplete} onDeleteTask={onDeleteTask} />
          </>
        ) : (
          <>
            <TaskList
              tasks={visibleTasks.filter((task) => !task.completed)}
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
              <CompletedTaskList tasks={filteredCompletedTasks} onRestoreTask={onToggleComplete} onDeleteTask={onDeleteTask} />
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
