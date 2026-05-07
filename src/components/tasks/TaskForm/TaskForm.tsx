import { useState } from "react";
import styles from "./TaskForm.module.scss";

interface TaskFormProps {
  onClose: () => void;
  onSubmitTask: (task: any) => Promise<void>;
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

export function TaskForm({ onClose, onSubmitTask, onAddCategory, categories, mode = "add", initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId?.toString() ?? "");
  const [dueDate, setDueDate] = useState(initialData?.dueAt ? initialData.dueAt.split("T")[0] : "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const trimmedTitle = title.trim();
  const isTitleInvalid = !trimmedTitle;
  const trimmedCategoryName = newCategoryName.trim();
  const isCategoryInvalid = !trimmedCategoryName;
  const isDuplicateCategory = categories.some((category) => category.name.toLowerCase() === trimmedCategoryName.toLowerCase());
  const isCategorySaveDisabled = isCategoryInvalid || isDuplicateCategory;

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isTitleInvalid) {
      return;
    }

    const newTask = {
      title: trimmedTitle,
      categoryId: categoryId ? Number(categoryId) : null,
      dueAt: dueDate || null,
      notes: notes.trim() || null,
    };

    try {
      await onSubmitTask(newTask);
      onClose();
    } catch (error) {
      console.error("Failed to submit task", error);
    }
  };

  const handleCreateCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      return;
    }
    const isDuplicate = categories.some((category) => category.name.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
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
        {title && isTitleInvalid ? <p className={styles["task-form__error"]}>Task title cannot be empty.</p> : null}
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
              className={`${styles["task-form__input"]} ${styles["task-form__input--white"]}`}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
            />
            {newCategoryName && isDuplicateCategory ? <p className={styles["task-form__error"]}>Category already exists.</p> : null}

            <div className={styles["task-form__add-category-actions"]}>
              <button
                type="button"
                className={`${styles["task-form__button"]} ${styles["task-form__button--primary"]}`}
                onClick={handleCreateCategory}
                disabled={isCategorySaveDisabled}
              >
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

        <button className={styles["task-form__button"] + " " + styles["task-form__button--primary"]} type="submit" disabled={isTitleInvalid}>
          {mode === "edit" ? "Update task" : mode === "duplicate" ? "Create duplicate" : "Save task"}
        </button>
      </div>
    </form>
  );
}
