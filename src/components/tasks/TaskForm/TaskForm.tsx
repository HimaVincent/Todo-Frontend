import { useState } from "react";
import styles from "./TaskForm.module.scss";

interface TaskFormProps {
  onClose: () => void;
  onAddTask: (task: any) => void;
  onAddCategory: (name: string) => Promise<{ id: number; name: string } | null>;
  categories: { id: number; name: string }[];
  mode?: "add" | "duplicate" | "edit";
  initialData?: {
    title: string;
    categoryId: number | null;
    dueAt?: string | null;
    notes?: string | null;
  };
}

export function TaskForm({ onClose, onAddTask, onAddCategory, categories, mode = "add", initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId?.toString() ?? "");
  const [dueDate, setDueDate] = useState(initialData?.dueAt ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTask = {
      title: title.trim(),
      categoryId: categoryId ? Number(categoryId) : null,
      dueAt: dueDate || null,
      notes: notes.trim() || null,
    };

    onAddTask(newTask);
    onClose();
  };

  const handleCreateCategory = async () => {
    const trimmed = newCategoryName.trim();

    if (!trimmed) {
      return;
    }

    const created = await onAddCategory(trimmed);

    if (!created) {
      return;
    }

    setCategoryId(String(created.id));
    setNewCategoryName("");
    setIsAddingCategory(false);
  };
  return (
    <form className={styles["task-form"]} onSubmit={handleSubmit}>
      <div className={styles["task-form__header"]}>
        <h3 className={styles["task-form__title"]}>{mode === "edit" ? "Edit Task" : mode === "duplicate" ? "Duplicate task" : "Add Task"}</h3>
      </div>

      <div className={styles["task-form__field"]}>
        <label className={styles["task-form__label"]} htmlFor="task-title">
          Title
        </label>
        <input
          id="task-title"
          className={styles["task-form__input"]}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className={styles["task-form__field"]}>
        <label className={styles["task-form__label"]} htmlFor="task-category">
          Category
        </label>
        <select id="task-category" className={styles["task-form__select"]} value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">No category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {!isAddingCategory ? (
          <button type="button" className={styles["task-form__add-category"]} onClick={() => setIsAddingCategory(true)}>
            + Add new category
          </button>
        ) : (
          <div className={styles["task-form__add-category-box"]}>
            <input
              type="text"
              className={styles["task-form__input"]}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
            />

            <div className={styles["task-form__add-category-actions"]}>
              <button type="button" className={styles["task-form__button"]} onClick={handleCreateCategory}>
                Save
              </button>

              <button
                type="button"
                className={styles["task-form__button"] + " " + styles["task-form__button--secondary"]}
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles["task-form__field"]}>
        <label className={styles["task-form__label"]} htmlFor="task-due-date">
          Due date
        </label>

        <input
          id="task-due-date"
          className={`${styles["task-form__input"]} ${styles["task-form__input--date"]}`}
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      <div className={styles["task-form__field"]}>
        <label className={styles["task-form__label"]} htmlFor="task-notes">
          Notes
        </label>
        <textarea
          id="task-notes"
          className={styles["task-form__textarea"]}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add details"
          rows={4}
        />
      </div>

      <div className={styles["task-form__actions"]}>
        <button className={styles["task-form__button"] + " " + styles["task-form__button--secondary"]} type="button" onClick={onClose}>
          Cancel
        </button>

        <button className={styles["task-form__button"] + " " + styles["task-form__button--primary"]} type="submit">
          {mode === "edit" ? "Update task" : mode === "duplicate" ? "Create duplicate" : "Save task"}
        </button>
      </div>
    </form>
  );
}
